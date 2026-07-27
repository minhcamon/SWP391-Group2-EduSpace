package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 5: Mentor dashboard, class monitoring, incidents, and arbitration using Selenium. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class MentorSystemTest extends SystemTestSupport {

    private static final String SEEDED_MENTOR_USERNAME = "mentor1";

    @Test
    void scenarioA_seededMentorCanOpenDashboardAndSeeAssignedClass() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        String token = login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded mentor login must store access_token in localStorage");

        enableMentorMode();
        driver.get(baseUrl + "/mentor");

        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Mentor Dashboard"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.className()));

        String bodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(bodyText.contains(fixture.className()), "Mentor dashboard must show the assigned class");
        assertTrue(bodyText.contains(fixture.courseTitle()), "Mentor dashboard must show the assigned course title");
    }

    @Test
    void scenarioB_seededMentorCanOpenClassDetailAndPairDetail() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> classDetailResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId(), null);
        assertStatus(200, classDetailResponse, "Mentor must be able to read assigned class detail API");
        Map<String, Object> classPairsResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId() + "/pairs", null);
        assertStatus(200, classPairsResponse, "Mentor must be able to read assigned class study groups API");
        assertTrue(String.valueOf(classPairsResponse.get("body")).contains(String.valueOf(fixture.studyGroupId())),
                "Mentor class pairs API must include the seeded study group");

        driver.get(baseUrl + "/mentor/classes/" + fixture.classId());
        wait.until(ExpectedConditions.urlContains("/mentor/classes/" + fixture.classId()));

        String classBodyText = driver.findElement(By.tagName("body")).getText();
        assertFalse(classBodyText.isBlank(), "Mentor class detail must render content");
        assertEquals("/mentor/classes/" + fixture.classId(), getCurrentPath(),
                "Mentor class detail route must stay open for mentor users");

        driver.get(baseUrl + "/mentor/pairs/" + fixture.studyGroupId());
        wait.until(ExpectedConditions.urlContains("/mentor/pairs/" + fixture.studyGroupId()));

        String pairBodyText = driver.findElement(By.tagName("body")).getText();
        assertFalse(pairBodyText.isBlank(),
                "Mentor pair detail must render the pair detail content");
        assertEquals("/mentor/pairs/" + fixture.studyGroupId(), getCurrentPath(),
                "Mentor pair detail route must stay open for mentor users");
    }

    @Test
    void scenarioC_mentorRouteRequiresMentorModeAfterLogin() {
        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);

        driver.get(baseUrl + "/mentor");

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Mentor route must redirect when mentor mode is not enabled");
    }

    @Test
    void scenarioD_guestCannotOpenMentorRoutes() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        driver.get(baseUrl + "/mentor/classes/" + fixture.classId());

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Guest access to mentor routes must redirect to home");
    }

    @Test
    void scenarioE_seededMentorCanOpenIncidentCenterAndIncidentDetail() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        driver.get(baseUrl + "/mentor/incidents");
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Incident Center"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), String.valueOf(fixture.incidentId())));

        String incidentListText = driver.findElement(By.tagName("body")).getText();
        assertTrue(incidentListText.contains(String.valueOf(fixture.incidentId())),
                "Mentor incident center must show the seeded incident");

        driver.get(baseUrl + "/mentor/incidents/" + fixture.incidentId());
        wait.until(ExpectedConditions.urlContains("/mentor/incidents/" + fixture.incidentId()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), String.valueOf(fixture.incidentId())));

        assertEquals("/mentor/incidents/" + fixture.incidentId(), getCurrentPath(),
                "Mentor incident detail route must stay open for mentor users");
        String incidentDetailText = driver.findElement(By.tagName("body")).getText();
        assertTrue(incidentDetailText.contains(String.valueOf(fixture.incidentId())),
                "Mentor incident detail must show the selected incident");
    }

    @Test
    void scenarioF_seededMentorCanOpenArbitrationAndSubmitFinalGrade() throws Exception {
        ArbitrationFixture fixture = createPendingArbitrationFixture(SEEDED_MENTOR_USERNAME);
        String mentorComment = "System test final arbitration comment " + shortId();

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> pendingDetail = incidentDetail(fixture.incidentId());
        assertEquals("PENDING", pendingDetail.get("status"),
                "New arbitration incident must start as PENDING");
        assertTrue(String.valueOf(pendingDetail.get("reason")).contains("arbitration"),
                "Arbitration fixture must expose the pending dispute reason");

        acceptIncident(fixture.incidentId());
        Map<String, Object> resolveResponse = apiRequest(
                "PUT",
                "/incidents/" + fixture.incidentId() + "/resolve",
                Map.of(
                        "resolutionNote", mentorComment,
                        "criteriaScores", java.util.List.of(
                                Map.of(
                                        "criterionName", "Mentor final review",
                                        "description", "System test final arbitration score",
                                        "maxPoint", 10,
                                        "score", 8))));
        assertStatus(200, resolveResponse, "Mentor must be able to resolve assignment dispute with a final score");

        Map<String, Object> resolvedDetail = incidentDetail(fixture.incidentId());
        assertEquals("RESOLVED", resolvedDetail.get("status"),
                "Resolved arbitration must move to RESOLVED");
        assertTrue(String.valueOf(resolvedDetail.get("resolutionNote")).contains(mentorComment),
                "Resolved arbitration must store the mentor comment");
        assertEquals(8, peerReviewFinalScore(fixture.submissionId()),
                "Arbitration regrade must store the mentor final score");
        assertEquals(mentorComment, peerReviewComments(fixture.submissionId()),
                "Arbitration regrade must store the mentor final comment");
        assertEquals("GRADED", submissionStatus(fixture.submissionId()),
                "Arbitration regrade with a passing score must mark the submission as GRADED");
    }

    @Test
    void scenarioG_seededMentorCanAcceptResolveWarnAndRejectIncidents() throws Exception {
        MentorIncidentFixture resolveFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "SYSTEM_ERROR",
                "System test resolve incident " + shortId());
        MentorIncidentFixture warnFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "INACTIVE_PARTNER",
                "System test warn incident " + shortId());
        MentorIncidentFixture rejectFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "MEMBER_CONFLICT",
                "System test reject incident " + shortId());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        String resolveNote = "Resolved by mentor workflow " + shortId();
        acceptIncident(resolveFixture.incidentId());
        resolveIncident(resolveFixture.incidentId(), resolveNote);

        Map<String, Object> resolvedDetail = incidentDetail(resolveFixture.incidentId());
        assertEquals("RESOLVED", resolvedDetail.get("status"),
                "Resolved incident must move to RESOLVED status");
        assertEquals(resolveNote, resolvedDetail.get("resolutionNote"),
                "Resolved incident must store the mentor resolution note");
        assertTrue(String.valueOf(resolvedDetail.get("resolvedByName")).length() > 0,
                "Resolved incident must record the assigned mentor");

        String warnNote = "Warned inactive partner " + shortId();
        acceptIncident(warnFixture.incidentId());
        warnIncident(warnFixture.incidentId(), warnNote);

        Map<String, Object> warnedDetail = incidentDetail(warnFixture.incidentId());
        assertEquals("IN_PROGRESS", warnedDetail.get("status"),
                "Warn action must keep the incident open for continued mentor follow-up");
        assertTrue(String.valueOf(warnedDetail.get("resolutionNote")).contains(warnNote),
                "Warn action must append the warning note");

        String rejectNote = "Rejected invalid incident " + shortId();
        acceptIncident(rejectFixture.incidentId());
        rejectIncident(rejectFixture.incidentId(), rejectNote);

        Map<String, Object> rejectedDetail = incidentDetail(rejectFixture.incidentId());
        assertEquals("REJECTED", rejectedDetail.get("status"),
                "Rejected incident must move to REJECTED status");
        assertTrue(String.valueOf(rejectedDetail.get("resolutionNote")).contains(rejectNote),
                "Rejected incident must store the rejection note");

        Map<String, Object> historyResponse = apiRequest("GET", "/incidents/history", null);
        assertStatus(200, historyResponse, "Mentor must be able to open resolved incident history");
        assertTrue(String.valueOf(historyResponse.get("body")).contains(String.valueOf(resolveFixture.incidentId())),
                "Incident history must include the resolved incident");
    }

    @Test
    void scenarioH_mentorCanSubmitListAndCancelWithdrawRequest() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);
        String reason = "System test mentor withdraw cancel " + shortId();

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> submitResponse = submitWithdrawRequest(fixture.classId(), reason);
        assertStatus(200, submitResponse, "Mentor must be able to submit a withdraw request");

        Map<String, Object> withdrawData = responseData(submitResponse);
        Long requestId = ((Number) withdrawData.get("id")).longValue();
        assertEquals("PENDING", withdrawData.get("status"),
                "Submitted withdraw request must start as PENDING");
        assertEquals("SCENARIO_A_SOFT", withdrawData.get("scenario"),
                "Class with another active mentor must use the soft withdrawal scenario");
        assertEquals("PENDING_WITHDRAWAL", classMemberStatus(fixture.mentorMemberId()),
                "Submitting withdraw request must mark mentor membership as pending withdrawal");

        Map<String, Object> duplicateResponse = submitWithdrawRequest(
                fixture.classId(),
                "Duplicate withdraw should be rejected " + shortId());
        assertEquals(400, ((Number) duplicateResponse.get("status")).intValue(),
                "Mentor must not submit another open withdraw request for the same class");

        Map<String, Object> myRequestsResponse = apiRequest("GET", "/mentor/withdraw-requests", null);
        assertStatus(200, myRequestsResponse, "Mentor must be able to list their withdraw requests");
        assertTrue(String.valueOf(myRequestsResponse.get("body")).contains(reason),
                "Mentor withdraw history must include the submitted request reason");

        Map<String, Object> detailResponse = apiRequest("GET", "/mentor/withdraw-requests/" + requestId, null);
        assertStatus(200, detailResponse, "Mentor must be able to read withdraw request detail");
        assertEquals(fixture.className(), responseData(detailResponse).get("className"),
                "Withdraw detail must reference the class that the mentor wants to leave");

        Map<String, Object> cancelResponse = apiRequest(
                "POST",
                "/mentor/classes/" + fixture.classId() + "/withdraw-requests/cancel",
                null);
        assertStatus(200, cancelResponse, "Mentor must be able to cancel a pending withdraw request");
        assertEquals("REJECTED", withdrawRequestStatus(requestId),
                "Canceled withdraw request must be closed as REJECTED");
        assertEquals("ACTIVE", classMemberStatus(fixture.mentorMemberId()),
                "Canceling withdraw request must restore mentor membership to ACTIVE");
        assertEquals(0, countOpenWithdrawRequests(fixture.mentorMemberId()),
                "Canceling withdraw request must leave no open withdraw request for the membership");
    }

    @Test
    void scenarioI_creatorCanReviewAndApproveSoftMentorWithdrawRequest() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);
        String reason = "System test creator approve withdraw " + shortId();

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> submitResponse = submitWithdrawRequest(fixture.classId(), reason);
        assertStatus(200, submitResponse, "Mentor must be able to submit a withdraw request for creator review");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();

        logout();
        login("creator1", SEEDED_PASSWORD);

        Map<String, Object> creatorListResponse = apiRequest("GET", "/creator/withdraw-requests", null);
        assertStatus(200, creatorListResponse, "Creator must be able to list withdraw requests for owned courses");
        assertTrue(String.valueOf(creatorListResponse.get("body")).contains(reason),
                "Creator withdraw request list must include mentor submitted reason");

        Map<String, Object> approveResponse = apiRequest(
                "POST",
                "/creator/withdraw-requests/" + requestId + "/approve-handover",
                null);
        assertStatus(200, approveResponse, "Creator must be able to directly approve a soft withdraw request");

        assertEquals("COMPLETED", withdrawRequestStatus(requestId),
                "Creator approval must complete the withdraw request");
        assertEquals("SCENARIO_A_SOFT", withdrawRequestScenario(requestId),
                "Approved request must keep its original soft withdrawal scenario");
        assertEquals("INACTIVE", classMemberStatus(fixture.mentorMemberId()),
                "Approved withdraw request must deactivate the leaving mentor membership");
    }

    @Test
    void scenarioJ_learnerCannotReadMentorClassApis() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        login("learner1", SEEDED_PASSWORD);

        Map<String, Object> classDetailResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId(), null);
        Map<String, Object> pairsResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId() + "/pairs", null);

        assertStatus(403, classDetailResponse, "Learner must not read mentor class detail API");
        assertStatus(403, pairsResponse, "Learner must not read mentor class pairs API");
    }

    @Test
    void scenarioK_mentorCannotAcceptIncidentOutsideAssignedClass() throws Exception {
        UnassignedMentorFixture fixture = createUnassignedMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> acceptResponse = apiRequest("PUT", "/incidents/" + fixture.incidentId() + "/accept", null);

        assertStatus(400, acceptResponse, "Mentor must not accept an incident outside assigned classes");
    }

    @Test
    void scenarioL_acceptingIncidentMovesItToInProgressAndAssignsMentor() throws Exception {
        MentorIncidentFixture fixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "SYSTEM_ERROR",
                "System test accept incident " + shortId());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        acceptIncident(fixture.incidentId());
        Map<String, Object> detail = incidentDetail(fixture.incidentId());

        assertEquals("IN_PROGRESS", detail.get("status"),
                "Accepted incident must move to IN_PROGRESS");
        assertTrue(String.valueOf(detail.get("resolvedByName")).length() > 0,
                "Accepted incident must assign the mentor as resolver");
    }

    @Test
    void scenarioM_creatorCanRejectSoftWithdrawRequest() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);
        String reason = "System test creator reject withdraw " + shortId();

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitWithdrawRequest(fixture.classId(), reason);
        assertStatus(200, submitResponse, "Mentor must be able to submit withdraw request");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();

        logout();
        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> rejectResponse = apiRequest(
                "POST",
                "/creator/withdraw-requests/" + requestId + "/reject",
                null);

        assertStatus(200, rejectResponse, "Creator must be able to reject a soft withdraw request");
        assertEquals("REJECTED", withdrawRequestStatus(requestId),
                "Rejected withdraw request must move to REJECTED");
        assertEquals("ACTIVE", classMemberStatus(fixture.mentorMemberId()),
                "Rejecting withdraw request must restore mentor membership");
    }

    @Test
    void scenarioN_creatorCannotApproveWithdrawRequestTwice() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitWithdrawRequest(
                fixture.classId(),
                "System test double approve withdraw " + shortId());
        assertStatus(200, submitResponse, "Mentor must be able to submit withdraw request");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();

        logout();
        login("creator1", SEEDED_PASSWORD);
        assertStatus(200, apiRequest("POST", "/creator/withdraw-requests/" + requestId + "/approve-handover", null),
                "Creator must be able to approve withdraw request once");

        Map<String, Object> secondApprove = apiRequest(
                "POST",
                "/creator/withdraw-requests/" + requestId + "/approve-handover",
                null);

        assertStatus(400, secondApprove, "Creator must not approve an already completed withdraw request twice");
        assertEquals("COMPLETED", withdrawRequestStatus(requestId),
                "Second approve attempt must leave request completed");
    }

    @Test
    void scenarioO_mentorDashboardOnlyShowsAssignedClasses() throws Exception {
        MentorFixture assigned = loadMentorFixture(SEEDED_MENTOR_USERNAME);
        UnassignedMentorFixture unassigned = createUnassignedMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> classesResponse = apiRequest("GET", "/mentor/classes", null);
        String body = String.valueOf(classesResponse.get("body"));

        assertStatus(200, classesResponse, "Mentor must be able to read assigned classes");
        assertTrue(body.contains(assigned.className()), "Mentor classes must include assigned class");
        assertFalse(body.contains(unassigned.className()), "Mentor classes must not include unassigned class");
    }

    @Test
    void scenarioP_mentorCannotReadPairDetailOutsideAssignedClass() throws Exception {
        UnassignedMentorFixture fixture = createUnassignedMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> pairResponse = apiRequest("GET", "/mentor/pairs/" + fixture.studyGroupId(), null);

        assertStatus(400, pairResponse, "Mentor must not read pair detail outside assigned classes");
    }

    @Test
    void scenarioQ_incidentHistoryDoesNotShowPendingIncidents() throws Exception {
        MentorIncidentFixture pending = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "SYSTEM_ERROR",
                "System pending history exclusion " + shortId());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> historyResponse = apiRequest("GET", "/incidents/history", null);

        assertStatus(200, historyResponse, "Mentor must be able to read incident history");
        assertFalse(responseDataList(historyResponse).stream()
                        .anyMatch(incident -> pending.incidentId().equals(((Number) incident.get("id")).longValue())),
                "Incident history must not include pending incidents");
    }

    @Test
    void scenarioR_warnedIncidentCanLaterBeResolved() throws Exception {
        MentorIncidentFixture fixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "INACTIVE_PARTNER",
                "System warned then resolved incident " + shortId());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        acceptIncident(fixture.incidentId());
        warnIncident(fixture.incidentId(), "Warning before resolution " + shortId());
        String resolveNote = "Resolved after warning " + shortId();
        resolveIncident(fixture.incidentId(), resolveNote);

        Map<String, Object> detail = incidentDetail(fixture.incidentId());
        assertEquals("RESOLVED", detail.get("status"),
                "Warned incident must later be resolvable");
        assertEquals(resolveNote, detail.get("resolutionNote"),
                "Final resolution note must be stored after warning");
    }

    @Test
    void scenarioS_creatorCanViewWithdrawRequestsButLearnerCannot() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);
        String reason = "System creator can view learner cannot " + shortId();

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        assertStatus(200, submitWithdrawRequest(fixture.classId(), reason),
                "Mentor must be able to submit withdraw request");

        logout();
        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> creatorResponse = apiRequest("GET", "/creator/withdraw-requests", null);
        assertStatus(200, creatorResponse, "Creator must be able to view withdraw requests");
        assertTrue(String.valueOf(creatorResponse.get("body")).contains(reason),
                "Creator response must include submitted withdraw request");

        logout();
        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> learnerResponse = apiRequest("GET", "/creator/withdraw-requests", null);
        assertStatus(403, learnerResponse, "Learner must not view creator withdraw request list");
    }

    @Test
    void scenarioT_cancelWithdrawAfterCreatorHandoverPendingRestoresReplacementMentor() throws Exception {
        WithdrawFixture fixture = createSoftWithdrawFixture(SEEDED_MENTOR_USERNAME);
        TestUser replacement = register("replacementmentor");
        Long replacementUserId = userIdByUsername(replacement.username());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitWithdrawRequest(
                fixture.classId(),
                "System handover pending cancel " + shortId());
        assertStatus(200, submitResponse, "Mentor must be able to submit withdraw request");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();

        logout();
        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> handoverResponse = apiRequest(
                "POST",
                "/creator/withdraw-requests/" + requestId + "/initiate-handover",
                Map.of("newMentorUserId", replacementUserId));
        assertStatus(200, handoverResponse, "Creator must be able to initiate handover");
        Long replacementMemberId = withdrawReplacementMemberId(requestId);
        assertEquals("ACTIVE", classMemberStatus(replacementMemberId),
                "Replacement mentor must be active while handover is pending");

        logout();
        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> cancelResponse = apiRequest(
                "POST",
                "/mentor/classes/" + fixture.classId() + "/withdraw-requests/cancel",
                null);

        assertStatus(200, cancelResponse, "Mentor must be able to cancel a handover-pending withdraw request");
        assertEquals("REJECTED", withdrawRequestStatus(requestId),
                "Canceled handover request must be rejected");
        assertEquals("ACTIVE", classMemberStatus(fixture.mentorMemberId()),
                "Canceling handover must restore original mentor");
        assertEquals("INACTIVE", classMemberStatus(replacementMemberId),
                "Canceling handover must deactivate replacement mentor membership");
    }

    @Test
    void scenarioU_urgentWithdrawUsesScenarioBWhenOnlyOneMentorExists() throws Exception {
        WithdrawFixture fixture = createUrgentWithdrawFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitWithdrawRequest(
                fixture.classId(),
                "System urgent withdraw scenario B " + shortId());

        assertStatus(200, submitResponse, "Sole mentor must be able to submit urgent withdraw request");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();
        assertEquals("SCENARIO_B_URGENT", withdrawRequestScenario(requestId),
                "Class with only one active mentor must use urgent scenario B");
    }

    @Test
    void scenarioV_creatorTakeOverUrgentWithdrawCompletesRequest() throws Exception {
        WithdrawFixture fixture = createUrgentWithdrawFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        Map<String, Object> submitResponse = submitWithdrawRequest(
                fixture.classId(),
                "System urgent creator takeover " + shortId());
        assertStatus(200, submitResponse, "Sole mentor must be able to submit urgent withdraw request");
        Long requestId = ((Number) responseData(submitResponse).get("id")).longValue();

        logout();
        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> takeoverResponse = apiRequest(
                "POST",
                "/creator/withdraw-requests/" + requestId + "/take-over",
                null);

        assertStatus(200, takeoverResponse, "Creator must be able to take over urgent withdraw request");
        assertEquals("COMPLETED", withdrawRequestStatus(requestId),
                "Creator takeover must complete urgent withdraw request");
        assertEquals("INACTIVE", classMemberStatus(fixture.mentorMemberId()),
                "Creator takeover must deactivate leaving mentor");
        assertTrue(countMentorMembershipsInClassForUser(fixture.classId(), "creator1") > 0,
                "Creator takeover must create creator mentor membership for the class");
    }

    private Map<String, Object> submitWithdrawRequest(Long classId, String reason) {
        return apiRequest(
                "POST",
                "/mentor/classes/" + classId + "/withdraw-requests",
                Map.of(
                        "reason", reason,
                        "expectedLeaveDate", "2099-01-15"));
    }

    private void acceptIncident(Long incidentId) {
        Map<String, Object> response = apiRequest("PUT", "/incidents/" + incidentId + "/accept", null);
        assertStatus(200, response, "Mentor must be able to accept a pending incident");
    }

    private void resolveIncident(Long incidentId, String note) {
        Map<String, Object> response = apiRequest(
                "PUT",
                "/incidents/" + incidentId + "/resolve",
                Map.of("resolutionNote", note));
        assertStatus(200, response, "Mentor must be able to resolve an accepted incident");
    }

    private void warnIncident(Long incidentId, String note) {
        Map<String, Object> response = apiRequest(
                "PUT",
                "/incidents/" + incidentId + "/warn",
                Map.of("resolutionNote", note));
        assertStatus(200, response, "Mentor must be able to warn within an accepted incident");
    }

    private void rejectIncident(Long incidentId, String note) {
        Map<String, Object> response = apiRequest(
                "PUT",
                "/incidents/" + incidentId + "/reject",
                Map.of("resolutionNote", note));
        assertStatus(200, response, "Mentor must be able to reject an accepted incident");
    }

    private Map<String, Object> incidentDetail(Long incidentId) {
        Map<String, Object> response = apiRequest("GET", "/incidents/" + incidentId, null);
        assertStatus(200, response, "Mentor must be able to read incident detail");
        return responseData(response);
    }

    private void assertStatus(int expectedStatus, Map<String, Object> response, String message) {
        assertEquals(expectedStatus, ((Number) response.get("status")).intValue(), message);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> responseData(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return (Map<String, Object>) body.get("data");
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> responseDataList(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return (List<Map<String, Object>>) body.get("data");
    }
}
