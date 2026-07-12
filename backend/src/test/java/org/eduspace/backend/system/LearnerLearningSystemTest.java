package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 4: Learner learning space and assignment access using Selenium. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class LearnerLearningSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_seededLearnerCanOpenMyLearningAndEnterLearningArea() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        driver.get(baseUrl + "/my-learning");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.courseTitle()));

        WebElement continueButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//h4[contains(., \"" + fixture.courseTitle()
                        + "\")]/ancestor::div[contains(@class,'group')][1]//button")));
        continueButton.click();

        wait.until(ExpectedConditions.urlContains("/courses/" + fixture.courseId() + "/learn"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.lessonTitle()));

        assertEquals("/courses/" + fixture.courseId() + "/learn", getCurrentPath(),
                "Continue learning must open the learning area for the enrolled course");
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(fixture.lessonTitle()),
                "Learning area must render the active lesson title from the seeded fixture");
    }

    @Test
    void scenarioB_seededLearnerCanOpenAssignmentWorkspaceWithReviewLockedUntilSubmission() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");

        login("learner1", SEEDED_PASSWORD);
        driver.get(baseUrl + "/classes/" + fixture.classId() + "/assignments/" + fixture.assignmentId());

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("essay-textarea")));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.assignmentTitle()));

        WebElement reviewTab = driver.findElement(By.xpath("//button[contains(., '2.')]"));
        assertTrue(reviewTab.getAttribute("class").contains("cursor-not-allowed"),
                "Peer review tab must stay locked before the learner submits the assignment");
        assertTrue(driver.findElement(By.id("essay-textarea")).isDisplayed(),
                "Assignment workspace must render the learner essay textarea");
    }

    @Test
    void scenarioC_guestCannotOpenProtectedAssignmentRoute() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");

        driver.get(baseUrl + "/classes/" + fixture.classId() + "/assignments/" + fixture.assignmentId());

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Guest access to a protected assignment route must redirect to home");
    }
}
