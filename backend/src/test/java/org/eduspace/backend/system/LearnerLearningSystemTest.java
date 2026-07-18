package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
    void scenarioB_assignmentSubmissionUnlocksPeerReviewAndGradingWorkflow() throws Exception {
        LearningWorkflowFixture workflow = prepareLearningWorkflowFixture("learner1", "learner2");
        LearningFixture learner = workflow.learner();
        LearningFixture reviewer = workflow.reviewer();

        login("learner1", SEEDED_PASSWORD);
        driver.get(baseUrl + "/classes/" + learner.classId() + "/assignments/" + learner.assignmentId());

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("essay-textarea")));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), learner.assignmentTitle()));

        WebElement reviewTab = driver.findElement(By.xpath("//button[contains(., '2.')]"));
        assertTrue(reviewTab.getAttribute("class").contains("cursor-not-allowed"),
                "Peer review tab must stay locked before the learner submits the assignment");
        assertTrue(driver.findElement(By.id("essay-textarea")).isDisplayed(),
                "Assignment workspace must render the learner essay textarea");

        Map<String, Object> learnerSubmit = submitAssignment(
                learner.memberId(),
                learner.assignmentId(),
                "Learner 1 system workflow submission " + shortId());
        assertStatus(201, learnerSubmit, "Learner submission must be accepted");

        logout();
        login("learner2", SEEDED_PASSWORD);

        Map<String, Object> lockedReview = apiRequest(
                "GET",
                "/submission/" + reviewer.classId() + "/assignment/" + reviewer.assignmentId()
                        + "/peer-review-assignment",
                null);
        assertStatus(400, lockedReview,
                "Reviewer must not access peer review before submitting their own assignment");

        Map<String, Object> reviewerSubmit = submitAssignment(
                reviewer.memberId(),
                reviewer.assignmentId(),
                "Learner 2 unlocks peer review with their own submission " + shortId());
        assertStatus(201, reviewerSubmit, "Reviewer submission must unlock peer review access");

        Map<String, Object> peerReviewResponse = apiRequest(
                "GET",
                "/submission/" + reviewer.classId() + "/assignment/" + reviewer.assignmentId()
                        + "/peer-review-assignment",
                null);
        assertStatus(200, peerReviewResponse,
                "Reviewer must receive a peer review assignment after submitting");

        Map<String, Object> peerReview = responseData(peerReviewResponse);
        Number reviewId = (Number) peerReview.get("reviewId");
        Number submissionId = (Number) peerReview.get("submissionId");
        assertNotNull(reviewId, "Peer review assignment must include review id");
        assertNotNull(submissionId, "Peer review assignment must point to the submitted work");
        assertEquals(learner.memberId().longValue(), ((Number) peerReview.get("submitterId")).longValue(),
                "Reviewer must grade the partner learner's submission");

        Map<String, Object> gradeResponse = apiRequest(
                "POST",
                "/submission/" + reviewer.classId() + "/peer-review/" + reviewId.longValue() + "/grade",
                Map.of(
                        "criteriaScores", List.of(
                                Map.of(
                                        "criterionName", "Workflow correctness",
                                        "description", "Submission unlocks review and receives a grade",
                                        "maxPoint", 5,
                                        "score", 5),
                                Map.of(
                                        "criterionName", "Review quality",
                                        "description", "Peer feedback is clear enough to complete grading",
                                        "maxPoint", 5,
                                        "score", 4)),
                        "finalScore", 9,
                        "comments", "System workflow peer review grade " + shortId()));
        assertStatus(200, gradeResponse, "Peer review grading must be accepted");

        logout();
        login("learner1", SEEDED_PASSWORD);

        Map<String, Object> gradedReviewResponse = apiRequest(
                "GET",
                "/submission/" + learner.classId() + "/assignment/" + learner.assignmentId() + "/review",
                null);
        assertStatus(200, gradedReviewResponse,
                "Submitter must be able to read the graded submission review");

        Map<String, Object> gradedReview = responseData(gradedReviewResponse);
        assertEquals("GRADED", gradedReview.get("status"),
                "Submitter's assignment must be marked graded after peer review score passes");
        assertTrue(String.valueOf(gradedReview.get("comments")).contains("System workflow peer review grade"),
                "Submitter review result must include the peer review comments");
    }

    @Test
    void scenarioC_guestCannotOpenProtectedAssignmentRoute() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");

        driver.get(baseUrl + "/classes/" + fixture.classId() + "/assignments/" + fixture.assignmentId());

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Guest access to a protected assignment route must redirect to home");
    }

    private Map<String, Object> submitAssignment(Long memberId, Long assignmentId, String content) {
        return apiRequest(
                "POST",
                "/submission/assignment/submit/" + memberId,
                Map.of(
                        "assignmentId", assignmentId,
                        "submissionContent", content));
    }

    private void assertStatus(int expectedStatus, Map<String, Object> response, String message) {
        assertEquals(expectedStatus, ((Number) response.get("status")).intValue(), message);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> responseData(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return (Map<String, Object>) body.get("data");
    }
}
