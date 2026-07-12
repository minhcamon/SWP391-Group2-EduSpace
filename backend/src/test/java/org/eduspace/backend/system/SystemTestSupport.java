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

    protected void setRole(String username, String role) throws Exception {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET role = ? WHERE username = ?")) {
            statement.setString(1, role);
            statement.setString(2, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be promoted");
        }
    }

    protected LearningFixture loadLearningFixture(String username) throws Exception {
        String sql = """
                SELECT
                    c.course_id,
                    c.title AS course_title,
                    cls.class_id,
                    m.module_id,
                    l.lesson_id,
                    l.title AS lesson_title,
                    a.assignment_id,
                    a.title AS assignment_title
                FROM users u
                JOIN class_members cm ON cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN modules m ON m.course_id = c.course_id
                JOIN lessons l ON l.module_id = m.module_id
                LEFT JOIN assignments a ON a.module_id = m.module_id
                WHERE u.username = ?
                  AND cm.learner_status = 'ACTIVE'
                ORDER BY cls.class_id, m.sort_order, l.sort_order
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded learner fixture to exist for " + username);

                Long assignmentId = resultSet.getObject("assignment_id", Long.class);
                String assignmentTitle = resultSet.getString("assignment_title");
                assertNotNull(assignmentId, "Expected the learner fixture to include an assignment");
                assertFalse(assignmentTitle == null || assignmentTitle.isBlank(),
                        "Expected the learner fixture to include an assignment title");

                return new LearningFixture(
                        resultSet.getLong("course_id"),
                        resultSet.getString("course_title"),
                        resultSet.getLong("class_id"),
                        resultSet.getLong("module_id"),
                        resultSet.getLong("lesson_id"),
                        resultSet.getString("lesson_title"),
                        assignmentId,
                        assignmentTitle);
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

    protected record LearningFixture(
            Long courseId,
            String courseTitle,
            Long classId,
            Long moduleId,
            Long lessonId,
            String lessonTitle,
            Long assignmentId,
            String assignmentTitle) {}
}
