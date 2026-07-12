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
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
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

    protected CertificateFixture loadCertificateFixture(String username) throws Exception {
        String sql = """
                SELECT
                    cm.id AS class_member_id,
                    cls.class_id,
                    c.course_id,
                    c.title AS course_title,
                    u.fullname AS user_name
                FROM users u
                JOIN class_members cm ON cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                WHERE u.username = ?
                  AND cm.context_role = 'LEARNER'
                ORDER BY cls.class_id
                LIMIT 1
                """;

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected certificate fixture to exist for " + username);
                return new CertificateFixture(
                        resultSet.getLong("class_member_id"),
                        resultSet.getLong("class_id"),
                        resultSet.getLong("course_id"),
                        resultSet.getString("course_title"),
                        resultSet.getString("user_name"));
            }
        }
    }

    protected void completeCourseForCertificate(CertificateFixture fixture) throws Exception {
        try (Connection connection = openConnection()) {
            for (Long lessonId : findIds(connection,
                    "SELECT l.lesson_id FROM lessons l JOIN modules m ON m.module_id = l.module_id WHERE m.course_id = ?",
                    fixture.courseId())) {
                insertCompletedLessonIfMissing(connection, fixture.classMemberId(), lessonId);
            }

            for (Long assignmentId : findIds(connection,
                    "SELECT a.assignment_id FROM assignments a JOIN modules m ON m.module_id = a.module_id WHERE m.course_id = ?",
                    fixture.courseId())) {
                insertGradedSubmissionIfMissing(connection, fixture.classMemberId(), assignmentId);
            }
        }
    }

    protected String getCurrentPath() {
        return URI.create(driver.getCurrentUrl()).getPath();
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private Connection openConnection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    private List<Long> findIds(Connection connection, String sql, Long parameter) throws Exception {
        List<Long> ids = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ids.add(resultSet.getLong(1));
                }
            }
        }
        assertFalse(ids.isEmpty(), "Expected certificate fixture to include course content");
        return ids;
    }

    private void insertCompletedLessonIfMissing(Connection connection, Long classMemberId, Long lessonId)
            throws Exception {
        if (exists(connection,
                "SELECT COUNT(*) FROM lesson_progresses WHERE class_member_id = ? AND lesson_id = ? AND is_completed = true",
                classMemberId, lessonId)) {
            return;
        }

        try (PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO lesson_progresses (class_member_id, lesson_id, is_completed, completed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)")) {
            statement.setLong(1, classMemberId);
            statement.setLong(2, lessonId);
            statement.setBoolean(3, true);
            statement.executeUpdate();
        }
    }

    private void insertGradedSubmissionIfMissing(Connection connection, Long classMemberId, Long assignmentId)
            throws Exception {
        if (exists(connection,
                "SELECT COUNT(*) FROM submissions WHERE learner_id = ? AND assignment_id = ? AND status = 'GRADED'",
                classMemberId, assignmentId)) {
            return;
        }

        try (PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO submissions (learner_id, assignment_id, submission_content, submitted_at, status) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'GRADED')")) {
            statement.setLong(1, classMemberId);
            statement.setLong(2, assignmentId);
            statement.setString(3, "System test completed submission for certificate workflow");
            statement.executeUpdate();
        }
    }

    private boolean exists(Connection connection, String sql, Long first, Long second) throws Exception {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, first);
            statement.setLong(2, second);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() && resultSet.getLong(1) > 0;
            }
        }
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

    protected record CertificateFixture(
            Long classMemberId,
            Long classId,
            Long courseId,
            String courseTitle,
            String userName) {}
}
