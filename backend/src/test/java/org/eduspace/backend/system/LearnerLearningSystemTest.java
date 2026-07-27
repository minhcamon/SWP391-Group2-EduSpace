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
        String lessonMarker = fixture.lessonTitle().contains("ArrayList") ? "ArrayList" : fixture.lessonTitle();
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), lessonMarker));

        assertEquals("/courses/" + fixture.courseId() + "/learn", getCurrentPath(),
                "Continue learning must open the learning area for the enrolled course");
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(lessonMarker),
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
                learner.classId(),
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
                reviewer.classId(),
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

    @Test
    void scenarioD_learnerCanReadSubmittedAssignmentBeforePeerGrade() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");
        resetSingleAssignmentSubmission(fixture.assignmentId(), fixture.memberId());

        login("learner1", SEEDED_PASSWORD);
        assertStatus(201, submitAssignment(
                        fixture.classId(),
                        fixture.assignmentId(),
                        "Submitted but not yet graded " + shortId()),
                "Learner submission must be accepted");

        Map<String, Object> reviewResponse = getReview(fixture);
        Map<String, Object> review = responseData(reviewResponse);

        assertStatus(200, reviewResponse, "Learner must be able to read their own submitted assignment");
        assertEquals("SUBMITTED", review.get("status"),
                "Submitted assignment must remain SUBMITTED before peer grading");
        assertTrue(String.valueOf(review.get("submissionContent")).contains("Submitted but not yet graded"),
                "Review payload must include the learner's submitted content");
    }

    @Test
    void scenarioE_lowPeerReviewScoreMarksSubmissionFailed() throws Exception {
        LearningWorkflowFixture workflow = prepareLearningWorkflowFixture("learner1", "learner2");
        LearningFixture learner = workflow.learner();
        LearningFixture reviewer = workflow.reviewer();

        Map<String, Object> peerReview = submitBothAndLoadPeerReview(learner, reviewer);
        Number reviewId = (Number) peerReview.get("reviewId");

        Map<String, Object> gradeResponse = gradePeerReview(
                reviewer.classId(),
                reviewId.longValue(),
                2,
                "Low score feedback " + shortId(),
                List.of(
                        criterion("Correctness", "Major requirements are missing", 5, 1),
                        criterion("Clarity", "Explanation is incomplete", 5, 1)));
        assertStatus(200, gradeResponse, "Low peer review grade must be accepted");

        logout();
        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> review = responseData(getReview(learner));

        assertEquals("FAILED", review.get("status"),
                "Low peer review score must mark the submission failed");
        assertTrue(String.valueOf(review.get("comments")).contains("Low score feedback"),
                "Failed submission review must include feedback comments");
    }

    @Test
    void scenarioF_wrongLearnerCannotGradeAnotherReviewerAssignment() throws Exception {
        LearningWorkflowFixture workflow = prepareLearningWorkflowFixture("learner1", "learner2");
        LearningFixture learner = workflow.learner();
        LearningFixture reviewer = workflow.reviewer();

        Map<String, Object> peerReview = submitBothAndLoadPeerReview(learner, reviewer);
        Number reviewId = (Number) peerReview.get("reviewId");

        logout();
        login("learner1", SEEDED_PASSWORD);

        Map<String, Object> gradeResponse = gradePeerReview(
                learner.classId(),
                reviewId.longValue(),
                9,
                "Wrong learner should not grade " + shortId(),
                passingCriteria());

        assertStatus(400, gradeResponse,
                "Learner who is not assigned as reviewer must not grade another review assignment");
    }

    @Test
    void scenarioG_learnerCannotSubmitAssignmentForClassTheyDoNotBelongTo() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");
        Long foreignClassId = findClassIdNotBelongingToLearner("learner1");

        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitAssignment(
                foreignClassId,
                fixture.assignmentId(),
                "Invalid foreign class submission " + shortId());

        assertStatus(400, submitResponse,
                "Learner must not submit an assignment for a class they do not belong to");
    }

    @Test
    void scenarioH_learnerCanOpenCourseDashboardForEnrolledClass() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");

        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> dashboardResponse = apiRequest(
                "GET",
                "/course/enroll/" + fixture.classId() + "/dashboard",
                null);

        assertStatus(200, dashboardResponse, "Learner must be able to open enrolled course dashboard");
        assertTrue(String.valueOf(dashboardResponse.get("body")).contains(String.valueOf(fixture.classId())),
                "Dashboard response must include the enrolled class id");
    }

    @Test
    void scenarioI_learnerCanCompleteLessonAndProgressChanges() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");
        int progressBefore = countLessonProgress(fixture.memberId(), fixture.lessonId());

        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> completeResponse = apiRequest(
                "POST",
                "/course/lessons/" + fixture.lessonId() + "/complete",
                fixture.classId());

        assertStatus(200, completeResponse, "Learner must be able to complete a lesson in their class");
        assertTrue(countLessonProgress(fixture.memberId(), fixture.lessonId()) > progressBefore,
                "Completing a lesson must add lesson progress for the learner");
    }

    @Test
    void scenarioJ_learnerCannotReadReviewBeforeSubmitting() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");
        resetSingleAssignmentSubmission(fixture.assignmentId(), fixture.memberId());

        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> reviewResponse = getReview(fixture);

        assertStatus(400, reviewResponse,
                "Learner must not read assignment review before submitting");
    }

    @Test
    void scenarioK_duplicateAssignmentSubmissionCreatesExpectedState() throws Exception {
        LearningFixture fixture = loadLearningFixture("learner1");
        resetSingleAssignmentSubmission(fixture.assignmentId(), fixture.memberId());

        login("learner1", SEEDED_PASSWORD);
        assertStatus(201, submitAssignment(
                        fixture.classId(),
                        fixture.assignmentId(),
                        "First duplicate scenario submission " + shortId()),
                "First submission must be accepted");
        assertStatus(201, submitAssignment(
                        fixture.classId(),
                        fixture.assignmentId(),
                        "Second duplicate scenario submission " + shortId()),
                "Current duplicate submission behavior must remain explicit");

        assertEquals(2, countSubmissions(fixture.assignmentId(), fixture.memberId()),
                "Duplicate submission scenario must create two submission rows under current behavior");
    }

    @Test
    void scenarioL_peerReviewGradeStoresRubricDetails() throws Exception {
        LearningWorkflowFixture workflow = prepareLearningWorkflowFixture("learner1", "learner2");
        LearningFixture learner = workflow.learner();
        LearningFixture reviewer = workflow.reviewer();

        Map<String, Object> peerReview = submitBothAndLoadPeerReview(learner, reviewer);
        Number reviewId = (Number) peerReview.get("reviewId");
        String comments = "Rubric detail feedback " + shortId();

        Map<String, Object> gradeResponse = gradePeerReview(
                reviewer.classId(),
                reviewId.longValue(),
                9,
                comments,
                passingCriteria());
        assertStatus(200, gradeResponse, "Peer review grade with rubric details must be accepted");

        logout();
        login("learner1", SEEDED_PASSWORD);
        String reviewBody = String.valueOf(getReview(learner).get("body"));

        assertTrue(reviewBody.contains("Workflow correctness"),
                "Stored review must include rubric criterion details");
        assertTrue(reviewBody.contains(comments),
                "Stored review must include reviewer comments");
    }

    @Test
    void scenarioM_failedSubmissionCanStillShowReviewFeedback() throws Exception {
        LearningWorkflowFixture workflow = prepareLearningWorkflowFixture("learner1", "learner2");
        LearningFixture learner = workflow.learner();
        LearningFixture reviewer = workflow.reviewer();

        Map<String, Object> peerReview = submitBothAndLoadPeerReview(learner, reviewer);
        Number reviewId = (Number) peerReview.get("reviewId");
        String comments = "Failed submission feedback remains visible " + shortId();

        assertStatus(200, gradePeerReview(
                        reviewer.classId(),
                        reviewId.longValue(),
                        1,
                        comments,
                        List.of(criterion("Minimum quality", "Needs resubmission", 10, 1))),
                "Failing peer review grade must be accepted");

        logout();
        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> review = responseData(getReview(learner));

        assertEquals("FAILED", review.get("status"),
                "Failed submission must keep FAILED status when reading review");
        assertTrue(String.valueOf(review.get("comments")).contains(comments),
                "Failed submission must still show review feedback");
    }

    private Map<String, Object> submitAssignment(Long classId, Long assignmentId, String content) {
        return apiRequest(
                "POST",
                "/submission/" + classId + "/assignment/submit",
                Map.of(
                        "assignmentId", assignmentId,
                        "submissionContent", content));
    }

    private Map<String, Object> getReview(LearningFixture fixture) {
        return apiRequest(
                "GET",
                "/submission/" + fixture.classId() + "/assignment/" + fixture.assignmentId() + "/review",
                null);
    }

    private Map<String, Object> submitBothAndLoadPeerReview(
            LearningFixture learner,
            LearningFixture reviewer) {
        login("learner1", SEEDED_PASSWORD);
        assertStatus(201, submitAssignment(
                        learner.classId(),
                        learner.assignmentId(),
                        "Submitter workflow content " + shortId()),
                "Submitter submission must be accepted");

        logout();
        login("learner2", SEEDED_PASSWORD);
        assertStatus(201, submitAssignment(
                        reviewer.classId(),
                        reviewer.assignmentId(),
                        "Reviewer workflow content " + shortId()),
                "Reviewer submission must be accepted");

        Map<String, Object> peerReviewResponse = apiRequest(
                "GET",
                "/submission/" + reviewer.classId() + "/assignment/" + reviewer.assignmentId()
                        + "/peer-review-assignment",
                null);
        assertStatus(200, peerReviewResponse,
                "Reviewer must receive peer review assignment after both learners submit");

        return responseData(peerReviewResponse);
    }

    private Map<String, Object> gradePeerReview(
            Long classId,
            Long reviewId,
            int finalScore,
            String comments,
            List<Map<String, Object>> criteriaScores) {
        return apiRequest(
                "POST",
                "/submission/" + classId + "/peer-review/" + reviewId + "/grade",
                Map.of(
                        "criteriaScores", criteriaScores,
                        "finalScore", finalScore,
                        "comments", comments));
    }

    private List<Map<String, Object>> passingCriteria() {
        return List.of(
                criterion("Workflow correctness", "Submission meets the expected requirements", 5, 5),
                criterion("Review quality", "Feedback is complete enough for grading", 5, 4));
    }

    private Map<String, Object> criterion(String name, String description, int maxPoint, int score) {
        return Map.of(
                "criterionName", name,
                "description", description,
                "maxPoint", maxPoint,
                "score", score);
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
