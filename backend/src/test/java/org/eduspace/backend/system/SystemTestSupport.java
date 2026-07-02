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
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

abstract class SystemTestSupport {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;
    
    protected static final String PASSWORD = "Test@1234";

    // Giữ lại cấu hình Database để phục vụ các case can thiệp quyền nâng cao nếu cần
    private final String dbUrl = setting("system.test.db-url", "SYSTEM_TEST_DB_URL",
            "jdbc:mysql://localhost:3306/swp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private final String dbUsername = setting("system.test.db-username", "SYSTEM_TEST_DB_USERNAME", "root");
    private final String dbPassword = setting("system.test.db-password", "SYSTEM_TEST_DB_PASSWORD", "123456");

    @BeforeEach
    void setUp() {
        // Lấy Base URL của FRONTEND (Ví dụ: http://localhost:5173)
        baseUrl = setting("system.test.base-url", "SYSTEM_TEST_BASE_URL", "http://localhost:5173");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");
        if (Boolean.getBoolean("headless")) {
            options.addArguments("--headless=new");
        }
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    /**
     * Đổi từ gửi POST sang giả lập nhập form Đăng ký trên UI
     */
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

        // Chờ điều hướng về trang login sau khi đăng ký thành công
        wait.until(ExpectedConditions.urlContains("/login"));
        
        return new TestUser(username, email);
    }

    /**
     * Đổi từ gửi POST login sang nhập form và lấy Token từ LocalStorage của Trình duyệt
     */
    protected String login(String username) {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(PASSWORD);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        // Chờ URL chuyển hướng (rời khỏi trang login tức là login thành công)
        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));

        // Lấy token từ localStorage giống như cách ứng dụng Frontend hoạt động
        Object token = ((JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('access_token');");
        
        return token != null ? token.toString() : "";
    }

    /**
     * Giữ nguyên hàm này vì chọc DB trực tiếp rất hữu ích cho việc chuẩn bị data test
     */
    protected void setRole(String username, String role) throws Exception {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET role = ? WHERE username = ?")) {
            statement.setString(1, role);
            statement.setString(2, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be promoted");
        }
    }

    protected String getCurrentPath() {
        return URI.create(driver.getCurrentUrl()).getPath();
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private static String setting(String property, String environment, String defaultValue) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) value = System.getenv(environment);
        return value == null || value.isBlank() ? defaultValue : value.replaceAll("/+$", "");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected record TestUser(String username, String email) {}
}