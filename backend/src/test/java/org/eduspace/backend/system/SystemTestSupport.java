package org.eduspace.backend.system;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

abstract class SystemTestSupport {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;

    protected static final String PASSWORD = "Test@1234";
    protected static final String SEEDED_PASSWORD = "password123";

    private final String dbUrl = setting("system.test.db-url", "SYSTEM_TEST_DB_URL",
            "jdbc:mysql://localhost:3306/swp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private final String dbUsername = setting("system.test.db-username", "SYSTEM_TEST_DB_USERNAME", "root");
    private final String dbPassword = setting("system.test.db-password", "SYSTEM_TEST_DB_PASSWORD", "123456");

    @BeforeEach
    void setUp() {
        baseUrl = setting("system.test.base-url", "SYSTEM_TEST_BASE_URL", "http://localhost:5173");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");
        options.addArguments("--headless=new");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected TestUser register(String prefix) {
        String username = prefix + shortId();
        String email = username + "@example.com";

        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        driver.findElement(By.id("fullname")).sendKeys("System Test User");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(PASSWORD);
        driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.urlContains("/login"));

        return new TestUser(username, email);
    }

    protected String login(String username) {
        return login(username, PASSWORD);
    }

    protected String login(String username, String password) {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));

        Object token = ((JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('access_token');");

        return token != null ? token.toString() : "";
    }

    protected void enableMentorMode() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.setItem('currentMode', 'MENTOR');");
    }

    protected void setRole(String username, String role) throws Exception {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET role = ? WHERE username = ?")) {
            statement.setString(1, role);
            statement.setString(2, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be promoted");
        }
    }

    protected MentorFixture loadMentorFixture(String username) throws Exception {
        String sql = """
                SELECT
                    cls.class_id,
                    cls.name AS class_name,
                    c.title AS course_title,
                    sg.study_group_id,
                    i.id AS incident_id
                FROM users u
                JOIN class_members cm ON cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN study_groups sg ON sg.class_id = cls.class_id
                LEFT JOIN incidents i ON i.reporter_id IN (
                    SELECT learner.id
                    FROM class_members learner
                    WHERE learner.class_id = cls.class_id
                      AND learner.context_role = 'LEARNER'
                )
                WHERE u.username = ?
                  AND cm.context_role = 'MENTOR'
                ORDER BY cls.class_id, sg.study_group_id, i.id
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded mentor fixture to exist for " + username);

                Long incidentId = resultSet.getObject("incident_id", Long.class);
                assertNotNull(incidentId, "Expected the mentor fixture to include a seeded incident");

                return new MentorFixture(
                        resultSet.getLong("class_id"),
                        resultSet.getString("class_name"),
                        resultSet.getString("course_title"),
                        resultSet.getLong("study_group_id"),
                        incidentId);
            }
        }
    }

    protected ArbitrationFixture createPendingArbitrationFixture(String username) throws Exception {
        String fixtureSql = """
                SELECT
                    cls.class_id,
                    cls.name AS class_name,
                    c.title AS course_title,
                    reporter.id AS reporter_member_id,
                    reporter_user.fullname AS reporter_name,
                    reported.id AS reported_member_id,
                    a.assignment_id,
                    a.title AS assignment_title
                FROM users u
                JOIN class_members mentor_cm ON mentor_cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = mentor_cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN class_members reporter ON reporter.class_id = cls.class_id
                    AND reporter.context_role = 'LEARNER'
                JOIN users reporter_user ON reporter_user.user_id = reporter.user_id
                JOIN class_members reported ON reported.class_id = cls.class_id
                    AND reported.context_role = 'LEARNER'
                    AND reported.id <> reporter.id
                JOIN modules m ON m.course_id = c.course_id
                JOIN assignments a ON a.module_id = m.module_id
                WHERE u.username = ?
                  AND mentor_cm.context_role = 'MENTOR'
                ORDER BY reporter.id, reported.id, a.assignment_id
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement fixtureStatement = connection.prepareStatement(fixtureSql)) {
            fixtureStatement.setString(1, username);

            try (ResultSet resultSet = fixtureStatement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded mentor arbitration fixture to exist for " + username);

                Long submissionId = insertSubmission(
                        connection,
                        resultSet.getLong("assignment_id"),
                        resultSet.getLong("reporter_member_id"));
                Long incidentId = insertArbitrationIncident(
                        connection,
                        submissionId,
                        resultSet.getLong("reporter_member_id"),
                        resultSet.getLong("reported_member_id"));

                return new ArbitrationFixture(
                        incidentId,
                        resultSet.getString("class_name"),
                        resultSet.getString("course_title"),
                        resultSet.getString("assignment_title"),
                        resultSet.getString("reporter_name"));
            }
        }
    }

    private Long insertSubmission(Connection connection, Long assignmentId, Long learnerMemberId) throws Exception {
        String sql = """
                INSERT INTO submissions (assignment_id, learner_id, submission_content, submitted_at, status)
                VALUES (?, ?, ?, NOW(), 'PENDING')
                """;

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, assignmentId);
            statement.setLong(2, learnerMemberId);
            statement.setString(3, "System test arbitration submission " + shortId());
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated submission id");
                return keys.getLong(1);
            }
        }
    }

    private Long insertArbitrationIncident(
            Connection connection,
            Long submissionId,
            Long reporterMemberId,
            Long reportedMemberId) throws Exception {
        String sql = """
                INSERT INTO incidents
                    (incident_type, submission_id, reporter_id, reported_id, reason, evidence_url, status, created_at)
                VALUES
                    ('PEER_REVIEW_DISPUTE', ?, ?, ?, ?, NULL, 'PENDING', NOW())
                """;

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, submissionId);
            statement.setLong(2, reporterMemberId);
            statement.setLong(3, reportedMemberId);
            statement.setString(4, "System test arbitration needs mentor grading " + shortId());
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated arbitration incident id");
                return keys.getLong(1);
            }
        }
    }

    protected String getCurrentPath() {
        return URI.create(driver.getCurrentUrl()).getPath();
    }

    protected void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login");
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private static String setting(String property, String environment, String defaultValue) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) {
            value = System.getenv(environment);
        }
        return value == null || value.isBlank() ? defaultValue : value.replaceAll("/+$", "");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected record TestUser(String username, String email) {}

    protected record MentorFixture(
            Long classId,
            String className,
            String courseTitle,
            Long studyGroupId,
            Long incidentId) {}

    protected record ArbitrationFixture(
            Long incidentId,
            String className,
            String courseTitle,
            String assignmentTitle,
            String reporterName) {}
}
