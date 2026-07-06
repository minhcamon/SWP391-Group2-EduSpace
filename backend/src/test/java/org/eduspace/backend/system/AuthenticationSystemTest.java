package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 1: User onboarding and authentication using Selenium. */
class AuthenticationSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_userCanRegisterLoginAndReadProfile() {
        TestUser learner = register("learner");

        String token = login(learner.username());
        assertFalse(token.isBlank(), "Login must store access_token in localStorage");

        driver.get(baseUrl + "/profile");
        wait.until(ExpectedConditions.urlContains("/profile"));
        wait.until(ExpectedConditions.attributeToBe(By.id("username"), "value", learner.username()));
        wait.until(ExpectedConditions.attributeToBe(By.id("email"), "value", learner.email()));

        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement emailField = driver.findElement(By.id("email"));

        assertEquals(learner.username(), usernameField.getAttribute("value"),
                "Profile page must show the learner username");
        assertEquals(learner.email(), emailField.getAttribute("value"),
                "Profile page must show the learner email");
    }

    @Test
    void scenarioB_loginWithWrongPasswordIsRejected() {
        TestUser learner = register("wrongpass");

        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")))
                .sendKeys(learner.username());
        driver.findElement(By.id("password")).sendKeys("Wrong@1234");
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        WebElement errorToast = wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        assertEquals("/login", getCurrentPath(), "Failed login must keep the user on /login");
        assertFalse(errorToast.getText().isBlank(), "Failed login must show an error message");
    }

    @Test
    void scenarioB_registrationWithInvalidEmailIsRejected() {
        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        driver.findElement(By.id("fullname")).sendKeys("Invalid Email User");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys("invalid" + shortId());
        driver.findElement(By.id("email")).sendKeys("not-an-email");
        driver.findElement(By.id("password")).sendKeys(PASSWORD);
        driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        assertEquals("/signup", getCurrentPath(), "Invalid email must not redirect to /login");
    }

    @Test
    void scenarioC_duplicateUsernameIsRejected() {
        TestUser original = register("duplicate");

        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        driver.findElement(By.id("fullname")).sendKeys("Duplicate User");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(original.username());
        driver.findElement(By.id("email")).sendKeys("other" + shortId() + "@example.com");
        driver.findElement(By.id("password")).sendKeys(PASSWORD);
        driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        WebElement errorToast = wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        assertEquals("/signup", getCurrentPath(), "Duplicate username must keep the user on /signup");
        assertTrue(errorToast.getText().contains("username") || !errorToast.getText().isBlank(),
                "Duplicate username must show an error message");
    }

    @Test
    void scenarioC_profileWithoutTokenIsRejected() {
        driver.get(baseUrl + "/profile");

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Unauthenticated profile access must redirect to home");
    }

    @Test
    void scenarioD_googleLoginButtonRedirectsToOAuthFlow() {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@type='button'][.//img[contains(@alt,'Google')]]"))).click();

        wait.until(driver -> driver.getCurrentUrl().contains("oauth2/authorization/google")
                || driver.getCurrentUrl().contains("accounts.google.com"));
        assertTrue(driver.getCurrentUrl().contains("google"));
    }
}