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
import java.time.Duration;
import java.util.Map;

/**
 * Browser-facing helpers shared by Selenium system tests.
 * Database fixture setup lives in {@link SystemTestFixtures}.
 */
abstract class SystemTestSupport extends SystemTestFixtures {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;

    protected static final String PASSWORD = "Test@1234";
    protected static final String SEEDED_PASSWORD = "password123";

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

    @SuppressWarnings("unchecked")
    protected Map<String, Object> apiRequest(String method, String path, Object body) {
        Object response = ((JavascriptExecutor) driver).executeAsyncScript("""
                const method = arguments[0];
                const path = arguments[1];
                const body = arguments[2];
                const done = arguments[arguments.length - 1];
                const token = window.localStorage.getItem('access_token');
                fetch('/api' + path, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: 'Bearer ' + token } : {})
                    },
                    body: body == null ? undefined : JSON.stringify(body)
                })
                    .then(async (res) => {
                        const text = await res.text();
                        let parsed = null;
                        try {
                            parsed = text ? JSON.parse(text) : null;
                        } catch {
                            parsed = text;
                        }
                        done({ ok: res.ok, status: res.status, body: parsed });
                    })
                    .catch((error) => done({ ok: false, status: 0, error: String(error) }));
                """, method, path, body);

        return (Map<String, Object>) response;
    }

    protected String getCurrentPath() {
        return URI.create(driver.getCurrentUrl()).getPath();
    }

    protected void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
