package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 7: Course enrollment waitlist and automatic class creation using API calls. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class EnrollmentSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_learnerJoinsWaitlistFromCourseDetailAndTriggersClassCreationAtCapacity() throws Exception {
        EnrollmentFixture fixture = createNearlyFullWaitlistFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> courseDetailResponse = apiRequest("GET", "/course/" + fixture.courseId(), null);
        assertStatus(200, courseDetailResponse, "Learner must be able to open the published course detail");

        Map<String, Object> course = responseData(courseDetailResponse);
        assertEquals(fixture.courseId().longValue(), ((Number) course.get("id")).longValue(),
                "Course detail must show the course that will be joined");

        assertEquals(9, countOpenWaitlistEntries(fixture.waitlistId()),
                "Fixture must start one member below waitlist capacity");

        Map<String, Object> enrollResponse = apiRequest(
                "POST",
                "/waitlist/enroll/" + fixture.courseId(),
                null);
        assertStatus(200, enrollResponse,
                "Joining waitlist from course detail must succeed for an authenticated learner");

        assertEquals("FULLED", waitlistStatus(fixture.waitlistId()),
                "Waitlist must be fulfilled when capacity is reached");
        assertTrue(countClassesForCourse(fixture.courseId()) > fixture.classCountBefore(),
                "Reaching waitlist capacity must create a running class for the course");
        assertTrue(countClassMembershipsForCourseAndUser(fixture.courseId(), fixture.finalLearnerId())
                        > fixture.finalLearnerMembershipCountBefore(),
                "Final joining learner must be enrolled as a class member in the created class");
        assertEquals(0, countOpenWaitlistEntries(fixture.waitlistId()),
                "Class creation must consume the fulfilled waitlist entries");
    }

    @Test
    void scenarioB_duplicateWaitlistEnrollmentIsRejected() throws Exception {
        WaitlistMembershipFixture fixture = createOpenWaitlistWithLearnerFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> duplicateResponse = apiRequest(
                "POST",
                "/waitlist/enroll/" + fixture.courseId(),
                null);

        assertStatus(400, duplicateResponse,
                "Learner must not be able to join the same opening waitlist twice");
        assertEquals(fixture.entriesBefore(), countOpenWaitlistEntries(fixture.waitlistId()),
                "Rejected duplicate enrollment must not create another waitlist entry");
        assertEquals("OPENING", waitlistStatus(fixture.waitlistId()),
                "Rejected duplicate enrollment must keep the waitlist open");
    }

    @Test
    void scenarioC_learnerCanLeaveOpeningWaitlist() throws Exception {
        WaitlistMembershipFixture fixture = createOpenWaitlistWithLearnerFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> leaveResponse = apiRequest(
                "DELETE",
                "/waitlist/leave/" + fixture.courseId(),
                null);

        assertStatus(200, leaveResponse,
                "Learner must be able to leave an opening waitlist");
        assertEquals(fixture.entriesBefore() - 1, countOpenWaitlistEntries(fixture.waitlistId()),
                "Leaving an opening waitlist must remove the learner entry");
        assertEquals("OPENING", waitlistStatus(fixture.waitlistId()),
                "Leaving an opening waitlist must not fulfill or close it");
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
