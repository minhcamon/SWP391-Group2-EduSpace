package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 6: Certificate receive, certificate details, and certificate access rules using API calls. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class CertificateReceiveSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_completedLearnerCanReadCertificateDetails() throws Exception {
        CertificateFixture fixture = createCertificateFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> response = certificateDetails(fixture.classId());
        assertStatus(200, response, "Completed learner must be able to read certificate details");

        Map<String, Object> certificate = responseBody(response);
        assertEquals(true, certificate.get("isCompleted"),
                "Certificate response must mark the learner as completed");
        assertEquals(fixture.learnerName(), certificate.get("userName"),
                "Certificate must show the learner full name");
        assertEquals(fixture.courseTitle(), certificate.get("courseTitle"),
                "Certificate must show the completed course title");
        assertEquals("EDU-CS-" + fixture.certificateId(), certificate.get("certificateId"),
                "Certificate id must use the EDU-CS display prefix");
        assertEquals(fixture.authorName(), certificate.get("author"),
                "Certificate must show the course creator as author");
        assertNotNull(certificate.get("issuedAt"), "Completed certificate must include issue time");
    }

    @Test
    void scenarioB_learnerWithoutCertificateGetsIncompleteCertificateState() throws Exception {
        CertificateFixture fixture = createIncompleteCertificateFixture("learner1");

        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> response = certificateDetails(fixture.classId());
        assertStatus(200, response,
                "Learner in class must be able to open certificate endpoint even before completion");

        Map<String, Object> certificate = responseBody(response);
        assertEquals(false, certificate.get("isCompleted"),
                "Learner without a certificate must not be marked completed");
        assertEquals("", certificate.get("certificateId"),
                "Incomplete learner must not receive a certificate id");
        assertNull(certificate.get("issuedAt"),
                "Incomplete learner must not receive an issue time");
        assertEquals(fixture.learnerName(), certificate.get("userName"),
                "Incomplete response must still identify the learner");
        assertEquals(fixture.courseTitle(), certificate.get("courseTitle"),
                "Incomplete response must still identify the course");
    }

    @Test
    void scenarioC_guestCannotReadCertificateDetails() throws Exception {
        CertificateFixture fixture = createCertificateFixture("learner1");

        driver.get(baseUrl + "/");
        Map<String, Object> response = certificateDetails(fixture.classId());

        assertStatus(401, response, "Guest must not read protected certificate API");
    }

    @Test
    void scenarioD_wrongLearnerCannotReadAnotherClassCertificate() throws Exception {
        CertificateFixture fixture = createCertificateFixture("learner1");
        TestUser outsider = register("certoutsider");

        login(outsider.username());
        Map<String, Object> response = certificateDetails(fixture.classId());

        assertStatus(400, response,
                "Learner must not read certificate details for a class they do not belong to");
    }

    @Test
    void scenarioE_readingCertificateDoesNotCreateDuplicateCertificateRows() throws Exception {
        CertificateFixture fixture = createCertificateFixture("learner1");
        int certificatesBefore = countCertificatesForUserAndCourse(fixture.userId(), fixture.courseId());

        login("learner1", SEEDED_PASSWORD);
        assertStatus(200, certificateDetails(fixture.classId()),
                "First certificate read must succeed");
        assertStatus(200, certificateDetails(fixture.classId()),
                "Second certificate read must also succeed");

        assertEquals(certificatesBefore, countCertificatesForUserAndCourse(fixture.userId(), fixture.courseId()),
                "Reading certificate details must not insert duplicate certificate rows");
        assertTrue(certificatesBefore > 0, "Fixture must start with a certificate row");
    }

    private Map<String, Object> certificateDetails(Long classId) {
        return apiRequest("GET", "/certificate/" + classId, null);
    }

    private void assertStatus(int expectedStatus, Map<String, Object> response, String message) {
        assertEquals(expectedStatus, ((Number) response.get("status")).intValue(), message);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> responseBody(Map<String, Object> response) {
        return (Map<String, Object>) response.get("body");
    }
}
