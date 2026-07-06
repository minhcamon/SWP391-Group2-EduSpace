package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 2: Course creation and approval lifecycle using Selenium. */
class CourseApprovalSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_creatorCreatesPendingCourseAdminPublishesAndGuestSeesIt() throws Exception {
        TestUser creator = register("creator");
        TestUser admin = register("admin");
        setRole(creator.username(), "CREATOR");
        setRole(admin.username(), "ADMIN");

        String title = "System Test Course " + shortId();
        String description = "Course created by an end-to-end workflow test";

        login(creator.username());
        createPendingCourse(title, description);

        driver.get(baseUrl + "/creator/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Creator must see the newly submitted pending course");

        logout();

        login(admin.username());
        driver.get(baseUrl + "/admin/courses-management");
        WebElement pendingCourseRow = waitForRowContaining(title);
        assertTrue(pendingCourseRow.getText().contains(title),
                "Admin must see the pending course before approval");

        pendingCourseRow.findElement(By.cssSelector("button.bg-emerald-600")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));
        wait.until(ExpectedConditions.invisibilityOf(pendingCourseRow));

        logout();

        driver.get(baseUrl + "/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Published course must be visible on the public course list");
    }

    @Test
    void scenarioB_creatorCanSaveDraftCourse() throws Exception {
        TestUser creator = register("draftcreator");
        setRole(creator.username(), "CREATOR");

        String title = "Draft Course " + shortId();

        login(creator.username());
        driver.get(baseUrl + "/creator/create-course");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title"))).sendKeys(title);
        driver.findElement(By.id("course-desc")).sendKeys("Draft course created by system test");

        driver.findElement(By.xpath("//button[contains(@class,'border-primary') and contains(@class,'text-primary')]"))
                .click();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Creator must see the saved draft course in course management");
    }

    @Test
    void scenarioC_learnerCannotOpenCreatorCourseBuilder() throws Exception {
        TestUser learner = register("courselearner");
        setRole(learner.username(), "LEARNER");

        login(learner.username());
        driver.get(baseUrl + "/creator/create-course");

        wait.until(driver -> !getCurrentPath().equals("/creator/create-course"));
        assertFalse(isElementPresent(By.id("course-title")),
                "Learner must not see the Creator course builder");
    }

    @Test
    void scenarioC_creatorCannotOpenAdminCourseModeration() throws Exception {
        TestUser creator = register("securecourse");
        setRole(creator.username(), "CREATOR");

        login(creator.username());
        driver.get(baseUrl + "/admin/courses-management");

        wait.until(driver -> !getCurrentPath().equals("/admin/courses-management"));
        assertFalse(getCurrentPath().equals("/admin/courses-management"),
                "Creator must not stay on the Admin course moderation page");
    }

    @Test
    void scenarioC_pendingCourseIsNotPubliclyVisible() throws Exception {
        TestUser creator = register("pendingcourse");
        setRole(creator.username(), "CREATOR");

        String title = "Private Pending Course " + shortId();

        login(creator.username());
        createPendingCourse(title, "Pending course should not be public yet");

        logout();

        driver.get(baseUrl + "/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertFalse(driver.findElement(By.tagName("body")).getText().contains(title),
                "Pending course must not be visible on the public course list");
    }

    private void createPendingCourse(String title, String description) {
        driver.get(baseUrl + "/creator/create-course");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title"))).sendKeys(title);
        driver.findElement(By.id("course-desc")).sendKeys(description);

        driver.findElement(By.xpath("//button[contains(@class,'bg-primary') and contains(@class,'text-white')]"))
                .click();

        WebElement dialog = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-slot='dialog-content']")));
        List<WebElement> submitOptions = dialog.findElements(By.cssSelector(".grid.grid-cols-1 button"));
        assertFalse(submitOptions.isEmpty(), "Course submit dialog must show submit options");
        submitOptions.get(0).click();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));
    }

    private WebElement waitForRowContaining(String text) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//tr[contains(., '" + text + "')]")));
    }

    private boolean isElementPresent(By locator) {
        return !driver.findElements(locator).isEmpty();
    }

    private void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login");
    }
}