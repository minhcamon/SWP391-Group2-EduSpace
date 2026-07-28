package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

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
        Long incidentId = fixture.incidentId();
        if (incidentId == null) {
            incidentId = createPendingMentorIncidentFixture(
                    SEEDED_MENTOR_USERNAME,
                    "SYSTEM_ERROR",
                    "System test incident center fallback " + shortId()).incidentId();
        }

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        driver.get(baseUrl + "/mentor/incidents");
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Incident Center"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), String.valueOf(incidentId)));

        String incidentListText = driver.findElement(By.tagName("body")).getText();
        assertTrue(incidentListText.contains(String.valueOf(incidentId)),
                "Mentor incident center must show the seeded incident");

        driver.get(baseUrl + "/mentor/incidents/" + incidentId);
        wait.until(ExpectedConditions.urlContains("/mentor/incidents/" + incidentId));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), String.valueOf(incidentId)));

        assertEquals("/mentor/incidents/" + incidentId, getCurrentPath(),
                "Mentor incident detail route must stay open for mentor users");
        String incidentDetailText = driver.findElement(By.tagName("body")).getText();
        assertTrue(incidentDetailText.contains(String.valueOf(incidentId)),
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
    void scenarioG_seededMentorCanAcceptResolveWarnRejectAndReadHistory() throws Exception {
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
    void scenarioH_learnerCannotReadMentorClassApis() throws Exception {
        MentorFixture fixture = loadMentorFixture(SEEDED_MENTOR_USERNAME);

        login("learner1", SEEDED_PASSWORD);

        Map<String, Object> classDetailResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId(), null);
        Map<String, Object> pairsResponse = apiRequest("GET", "/mentor/classes/" + fixture.classId() + "/pairs", null);

        assertStatus(403, classDetailResponse, "Learner must not read mentor class detail API");
        assertStatus(403, pairsResponse, "Learner must not read mentor class pairs API");
    }

    @Test
    void scenarioI_mentorCannotAccessDataOutsideAssignedClasses() throws Exception {
        UnassignedMentorFixture fixture = createUnassignedMentorFixture(SEEDED_MENTOR_USERNAME);

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        Map<String, Object> acceptResponse = apiRequest("PUT", "/incidents/" + fixture.incidentId() + "/accept", null);
        Map<String, Object> pairResponse = apiRequest("GET", "/mentor/pairs/" + fixture.studyGroupId(), null);

        assertStatus(400, acceptResponse, "Mentor must not accept an incident outside assigned classes");
        assertStatus(400, pairResponse, "Mentor must not read pair detail outside assigned classes");
    }

    @Test
    void scenarioJ_mentorDashboardOnlyShowsAssignedClasses() throws Exception {
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

}
