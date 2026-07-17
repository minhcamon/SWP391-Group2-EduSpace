package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

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

    private static String pairCode(Long studyGroupId) {
        return "PAIR-0" + studyGroupId;
    }
}
