package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 5: Mentor dashboard, class monitoring, and pair access using Selenium. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class MentorSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_seededMentorCanOpenDashboardAndSeeAssignedClass() throws Exception {
        MentorFixture fixture = loadMentorFixture("mentor1");

        String token = login("mentor1", SEEDED_PASSWORD);
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
        MentorFixture fixture = loadMentorFixture("mentor1");

        login("mentor1", SEEDED_PASSWORD);
        enableMentorMode();

        driver.get(baseUrl + "/mentor/classes/" + fixture.classId());
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.className()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "PAIR-0" + fixture.studyGroupId()));

        String classBodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(classBodyText.contains(fixture.courseTitle()),
                "Mentor class detail must show the course title");
        assertTrue(classBodyText.contains("PAIR-0" + fixture.studyGroupId()),
                "Mentor class detail must show the seeded study group");

        driver.get(baseUrl + "/mentor/pairs/" + fixture.studyGroupId());
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.className()));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Pair " + fixture.studyGroupId()));

        String pairBodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(pairBodyText.contains(fixture.className()),
                "Mentor pair detail must show the class that owns the pair");
        assertTrue(pairBodyText.contains("Pair " + fixture.studyGroupId()),
                "Mentor pair detail must show the selected pair name");
    }

    @Test
    void scenarioC_mentorRouteRequiresMentorModeAfterLogin() {
        login("mentor1", SEEDED_PASSWORD);

        driver.get(baseUrl + "/mentor");

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Mentor route must redirect when mentor mode is not enabled");
    }

    @Test
    void scenarioC_guestCannotOpenMentorRoutes() throws Exception {
        MentorFixture fixture = loadMentorFixture("mentor1");

        driver.get(baseUrl + "/mentor/classes/" + fixture.classId());

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Guest access to mentor routes must redirect to home");
    }
}
