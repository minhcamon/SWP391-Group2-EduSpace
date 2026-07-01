package org.eduspace.backend.system;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.net.HttpURLConnection;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginSystemTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = resolveBaseUrl();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");
        // options.addArguments("--headless=new");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    void loginWithValidCredentialsStoresTokenAndLeavesLoginPage() {
        String username = "login" + UUID.randomUUID().toString().substring(0, 8);
        registerUser(username);
        openLoginAndSubmit(username, "Test@1234");

        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
        Object token = ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('access_token');");

        assertFalse(URI.create(driver.getCurrentUrl()).getPath().equals("/login"));
        assertNotNull(token, "Successful login must store a JWT in localStorage");
    }

    @Test
    void loginWithWrongPasswordShowsErrorAndStaysOnLoginPage() {
        openLoginAndSubmit("admin", "wrong-password");

        WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));
        assertTrue(URI.create(driver.getCurrentUrl()).getPath().equals("/login"));
        assertFalse(toast.getText().isBlank(), "Invalid login must display an error message");
    }

    @Test
    void registerWithValidDataRedirectsToLogin() {
        String username = "selenium" + UUID.randomUUID().toString().substring(0, 8);
        registerUser(username);
        assertTrue(URI.create(driver.getCurrentUrl()).getPath().equals("/login"));
    }

    private void registerUser(String username) {
        driver.get(baseUrl + "/signup");
        driver.findElement(By.id("fullname")).sendKeys("Selenium Test");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(username + "@example.com");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("confirmPassword")).sendKeys("Test@1234");
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.urlContains("/login"));
    }

    @Test
    void googleLoginButtonRedirectsToOAuthFlow() {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@type='button'][.//img[contains(@alt,'Google')]]"))).click();

        wait.until(driver -> driver.getCurrentUrl().contains("oauth2/authorization/google")
                || driver.getCurrentUrl().contains("accounts.google.com"));
        assertTrue(driver.getCurrentUrl().contains("google"));
    }

    private void openLoginAndSubmit(String username, String password) {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();
    }

    private String resolveBaseUrl() {
        String configured = System.getProperty("system.test.base-url");
        if (configured == null || configured.isBlank()) {
            configured = System.getenv("SYSTEM_TEST_BASE_URL");
        }
        if (configured != null && !configured.isBlank()) {
            String normalized = configured.replaceAll("/+$", "");
            ensureAvailable(normalized);
            return normalized;
        }

        for (String candidate : new String[]{"http://localhost:5173", "http://localhost"}) {
            if (isAvailable(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Frontend is unavailable. Start Vite on :5173 or Docker on :80, "
                + "or set -Dsystem.test.base-url=<url>.");
    }

    private void ensureAvailable(String url) {
        if (!isAvailable(url)) {
            throw new IllegalStateException("Frontend is unavailable at " + url);
        }
    }

    private boolean isAvailable(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) URI.create(url + "/login").toURL().openConnection();
            connection.setConnectTimeout(2_000);
            connection.setReadTimeout(2_000);
            connection.setInstanceFollowRedirects(true);
            int status = connection.getResponseCode();
            connection.disconnect();
            return status >= 200 && status < 400;
        } catch (Exception ignored) {
            return false;
        }
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}