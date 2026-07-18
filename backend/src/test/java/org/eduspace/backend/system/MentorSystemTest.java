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
        String expectedPairCode = pairCode(fixture.studyGroupId());

        login(SEEDED_MENTOR_USERNAME, SEEDED_PASSWORD);
        enableMentorMode();

        driver.get(baseUrl + "/mentor/classes/" + fixture.classId());
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.className()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), expectedPairCode));

        String classBodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(classBodyText.contains(fixture.courseTitle()),
                "Mentor class detail must show the course title");
        assertTrue(classBodyText.contains(expectedPairCode),
                "Mentor class detail must show the seeded study group");

        driver.get(baseUrl + "/mentor/pairs/" + fixture.studyGroupId());
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.className()));

        String pairBodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(pairBodyText.contains(fixture.className()),
                "Mentor pair detail must show the class that owns the pair");
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

        driver.get(baseUrl + "/mentor/arbitrations");
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Arbitration Center"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), String.valueOf(fixture.incidentId())));

        String arbitrationListText = driver.findElement(By.tagName("body")).getText();
        assertTrue(arbitrationListText.contains(String.valueOf(fixture.incidentId())),
                "Mentor arbitration center must show the pending arbitration");
        assertTrue(arbitrationListText.contains(fixture.assignmentTitle()),
                "Mentor arbitration center must show the arbitration assignment");

        driver.get(baseUrl + "/mentor/arbitrations/" + fixture.incidentId());
        wait.until(ExpectedConditions.urlContains("/mentor/arbitrations/" + fixture.incidentId()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.assignmentTitle()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.reporterName()));

        driver.findElement(By.cssSelector("form input[type='number']")).sendKeys("8");
        driver.findElement(By.cssSelector("form textarea")).sendKeys(mentorComment);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), mentorComment));

        assertEquals("/mentor/arbitrations/" + fixture.incidentId(), getCurrentPath(),
                "Mentor arbitration detail route must stay open after grading");
        String arbitrationDetailText = driver.findElement(By.tagName("body")).getText();
        assertTrue(arbitrationDetailText.contains(mentorComment),
                "Mentor arbitration detail must show the submitted final arbitration comment");
    }

    @Test
    void scenarioG_seededMentorCanAcceptResolveWarnAndMediateIncidents() throws Exception {
        MentorIncidentFixture resolveFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "SYSTEM_ERROR",
                "System test resolve incident " + shortId());
        MentorIncidentFixture warnFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "INACTIVE_PARTNER",
                "System test warn incident " + shortId());
        MentorIncidentFixture mediateFixture = createPendingMentorIncidentFixture(
                SEEDED_MENTOR_USERNAME,
                "MEMBER_CONFLICT",
                "System test mediate incident " + shortId());

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

        String mediateNote = "Mediated partner conflict " + shortId();
        acceptIncident(mediateFixture.incidentId());
        mediateIncident(mediateFixture.incidentId(), mediateNote);

        Map<String, Object> mediatedDetail = incidentDetail(mediateFixture.incidentId());
        assertEquals("RESOLVED", mediatedDetail.get("status"),
                "Mediated incident must be closed as resolved");
        assertTrue(String.valueOf(mediatedDetail.get("resolutionNote")).contains(mediateNote),
                "Mediated incident must store the mediation note");

        Map<String, Object> historyResponse = apiRequest("GET", "/incidents/history", null);
        assertStatus(200, historyResponse, "Mentor must be able to open resolved incident history");
        assertTrue(String.valueOf(historyResponse.get("body")).contains(String.valueOf(resolveFixture.incidentId())),
                "Incident history must include the resolved incident");
        assertTrue(String.valueOf(historyResponse.get("body")).contains(String.valueOf(mediateFixture.incidentId())),
                "Incident history must include the mediated incident");
    }

    private static String pairCode(Long studyGroupId) {
        return "PAIR-0" + studyGroupId;
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
                "POST",
                "/incidents/" + incidentId + "/warn",
                Map.of("resolutionNote", note));
        assertStatus(200, response, "Mentor must be able to warn within an accepted incident");
    }

    private void mediateIncident(Long incidentId, String note) {
        Map<String, Object> response = apiRequest(
                "POST",
                "/incidents/" + incidentId + "/mediate",
                Map.of("resolutionNote", note));
        assertStatus(200, response, "Mentor must be able to mediate an accepted incident");
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
