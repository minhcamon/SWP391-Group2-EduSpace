package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 6: Course completion certificate access using Selenium. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class CertificateSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_completedLearnerCanReceiveAndViewCertificate() throws Exception {
        CertificateFixture fixture = loadCertificateFixture("learner1");
        completeCourseForCertificate(fixture);

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        driver.get(baseUrl + "/classes/" + fixture.classId() + "/certificate");

        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"),
                "Certificate of Completion"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), fixture.courseTitle()));

        String bodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(bodyText.contains(fixture.userName()), "Certificate must show the learner full name");
        assertTrue(bodyText.contains(fixture.courseTitle()), "Certificate must show the completed course title");
        assertTrue(bodyText.contains("EDU-CS-"), "Certificate must show a generated EduSpace certificate id");
    }

    @Test
    void scenarioB_incompleteLearnerSeesLockedCertificateState() throws Exception {
        CertificateFixture fixture = loadCertificateFixture("learner5");

        login("learner5", SEEDED_PASSWORD);
        driver.get(baseUrl + "/classes/" + fixture.classId() + "/certificate");

        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"),
                "Chá»©ng chá»‰ Ä‘ang bá»‹ khÃ³a"));

        String bodyText = driver.findElement(By.tagName("body")).getText();
        assertTrue(bodyText.contains(fixture.courseTitle()),
                "Locked certificate state must still show the course title");
        assertFalse(bodyText.contains("EDU-CS-"),
                "Incomplete learners must not receive a generated certificate id");
    }

    @Test
    void scenarioC_guestCannotOpenCertificateRoute() throws Exception {
        CertificateFixture fixture = loadCertificateFixture("learner1");

        driver.get(baseUrl + "/classes/" + fixture.classId() + "/certificate");

        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        assertEquals("/", getCurrentPath(), "Guest access to certificate route must redirect to home");
    }
}
