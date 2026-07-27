package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 1: User onboarding and authentication using Selenium. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
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

    @Test
    void scenarioE_checkUsernameAvailabilityReflectsExistingUser() {
        TestUser learner = register("checkuser");

        Map<String, Object> taken = publicApiRequest("POST", "/auth/check-username",
                Map.of("username", learner.username()));
        Map<String, Object> available = publicApiRequest("POST", "/auth/check-username",
                Map.of("username", "available" + shortId()));

        assertEquals(400L, taken.get("status"), "Existing username must be rejected");
        assertEquals(200L, available.get("status"), "Unused username must be available");
    }

    @Test
    void scenarioF_checkEmailAvailabilityReflectsExistingEmail() {
        TestUser learner = register("checkmail");

        Map<String, Object> taken = publicApiRequest("POST", "/auth/check-email",
                Map.of("email", learner.email()));
        Map<String, Object> available = publicApiRequest("POST", "/auth/check-email",
                Map.of("email", "available" + shortId() + "@example.com"));

        assertEquals(400L, taken.get("status"), "Existing email must be rejected");
        assertEquals(200L, available.get("status"), "Unused email must be available");
    }

    @Test
    void scenarioG_passwordConfirmationMismatchIsRejected() {
        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        String username = "mismatch" + shortId();
        fillRegistrationForm(username, username + "@example.com", PASSWORD, "Different@1234", true);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        WebElement errorToast = wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        assertEquals("/signup", getCurrentPath(), "Password mismatch must keep the user on /signup");
        assertFalse(errorToast.getText().isBlank(), "Password mismatch must show an error message");
    }

    @Test
    void scenarioH_verifiedOrActiveUserCannotRequestResendVerification() {
        TestUser learner = register("resendactive");

        Map<String, Object> response = publicApiRequest("POST", "/auth/resend-verification",
                Map.of("email", learner.email()));

        assertEquals(400L, response.get("status"),
                "An ACTIVE user must not be able to request another verification email");
    }

    @Test
    void scenarioI_loginByEmailWorksSameAsUsername() {
        TestUser learner = register("emaillogin");

        String token = login(learner.email());

        assertFalse(token.isBlank(), "Login by email must store access_token in localStorage");
    }

    @Test
    void scenarioJ_logoutClearsSessionAndBlocksProfileAccess() {
        TestUser learner = register("logout");
        login(learner.username());

        logout();
        Object token = ((JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('access_token');");

        driver.get(baseUrl + "/profile");
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));

        assertEquals(null, token, "Logout must clear access_token from localStorage");
        assertEquals("/", getCurrentPath(), "Profile access after logout must redirect to home");
    }

    @Test
    void scenarioK_registerWithoutAcceptingTermsIsRejected() {
        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        String username = "noterms" + shortId();
        fillRegistrationForm(username, username + "@example.com", PASSWORD, PASSWORD, false);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        assertEquals("/signup", getCurrentPath(), "Registration without accepting terms must stay on /signup");
        wait.until(driver -> {
            try {
                return !userExists(username);
            } catch (Exception e) {
                return false;
            }
        });
    }

    @Test
    void scenarioL_duplicateEmailIsRejectedEvenWithDifferentUsername() {
        TestUser original = register("dupmail");

        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        fillRegistrationForm("different" + shortId(), original.email(), PASSWORD, PASSWORD, true);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        WebElement errorToast = wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        assertEquals("/signup", getCurrentPath(), "Duplicate email must keep the user on /signup");
        assertTrue(errorToast.getText().contains("email") || !errorToast.getText().isBlank(),
                "Duplicate email must show an error message");
    }

    private void fillRegistrationForm(
            String username,
            String email,
            String password,
            String confirmPassword,
            boolean acceptTerms) {
        driver.findElement(By.id("fullname")).sendKeys("System Test User");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.id("confirmPassword")).sendKeys(confirmPassword);
        if (acceptTerms) {
            driver.findElement(By.id("terms")).click();
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> publicApiRequest(String method, String path, Object body) {
        driver.get(baseUrl + "/");
        Object response = ((JavascriptExecutor) driver).executeAsyncScript("""
                const method = arguments[0];
                const apiUrl = arguments[1];
                const path = arguments[2];
                const body = arguments[3];
                const done = arguments[arguments.length - 1];
                fetch(apiUrl + path, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
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
                """, method, backendApiUrl, path, body);

        return (Map<String, Object>) response;
    }
}
