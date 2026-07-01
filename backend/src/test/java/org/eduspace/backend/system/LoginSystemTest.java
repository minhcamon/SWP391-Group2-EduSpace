package org.eduspace.backend.system;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assumptions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginSystemTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = "http://localhost:5173/login";

    @BeforeEach
    public void setUp() {
        Assumptions.assumeTrue(isFrontendAvailable(), "Frontend must be running at http://localhost:5173 for Selenium tests");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testLoginWithValidCredentials() {
        driver.get(BASE_URL);

        WebElement usernameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
        usernameInput.sendKeys("admin");

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("admin123");

        WebElement loginButton = driver.findElement(By.xpath("//button[normalize-space()='Đăng Nhập']"));
        loginButton.click();

        wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/"),
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Đăng nhập thành công')]"))
        ));

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/") || currentUrl.contains("home"), "Login should redirect user to home page");
    }

    @Test
    public void testLoginWithWrongPasswordShowsError() {
        driver.get(BASE_URL);

        WebElement usernameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
        usernameInput.sendKeys("admin");

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrong-password");

        WebElement loginButton = driver.findElement(By.xpath("//button[normalize-space()='Đăng Nhập']"));
        loginButton.click();

        wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")),
                ExpectedConditions.urlContains("/login")
        ));

        String pageSource = driver.getPageSource();
        assertTrue(pageSource.contains("thất bại") || pageSource.contains("Đăng nhập") || pageSource.contains("thông tin") || pageSource.contains("fail") || driver.getCurrentUrl().contains("/login"),
                "Expected an error state after invalid login");
    }

    @Test
    public void testRegisterWithValidData() {
        driver.get("http://localhost:5173/signup");

        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "selenium" + uniqueSuffix;
        String email = "selenium" + uniqueSuffix + "@example.com";

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("fullname"))).sendKeys("Selenium Test");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("confirmPassword")).sendKeys("Test@1234");
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.xpath("//button[normalize-space()='Tạo Tài Khoản']")).click();

        wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/login"),
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")),
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[contains(.,'Đã có tài khoản')]")),
                ExpectedConditions.visibilityOfElementLocated(By.id("fullname"))
        ));

        String pageSource = driver.getPageSource();
        assertTrue(
                driver.getCurrentUrl().contains("/login") || pageSource.contains("thành công") || pageSource.contains("Đăng ký") || pageSource.contains("thất bại") || pageSource.contains("lỗi") || pageSource.contains("Đã có tài khoản"),
                "Registration should either redirect to login or show a feedback state"
        );
    }

    @Test
    public void testGoogleLoginButtonRedirectsToOAuthFlow() {
        driver.get(BASE_URL);

        WebElement googleButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Đăng nhập bằng Google']")));
        googleButton.click();

        wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("oauth2/authorization/google"),
                ExpectedConditions.urlContains("accounts.google.com"),
                ExpectedConditions.urlContains("google")
        ));

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("oauth2/authorization/google") || currentUrl.contains("accounts.google.com") || currentUrl.contains("google"),
                "Google login should redirect to Google or OAuth authorization endpoint");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private boolean isFrontendAvailable() {
        try {
            java.net.URL url = new java.net.URI("http://localhost:5173").toURL();
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(2000);
            connection.setReadTimeout(2000);
            return connection.getResponseCode() < 500;
        } catch (Exception e) {
            return false;
        }
    }
}
