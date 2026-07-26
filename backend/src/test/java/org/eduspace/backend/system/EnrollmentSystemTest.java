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

    @Test
    void scenarioD_creatorCanViewOwnWaitlistsAndDetails() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Creator Waitlist View Course", 2);

        String token = login("creator1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded creator login must store access_token in localStorage");

        Map<String, Object> waitlistsResponse = apiRequest("GET", "/waitlist/creator", null);
        assertStatus(200, waitlistsResponse, "Creator must be able to view own opening waitlists");
        assertTrue(String.valueOf(waitlistsResponse.get("body")).contains(fixture.courseTitle()),
                "Creator waitlist list must include their own course waitlist");

        Map<String, Object> detailsResponse = apiRequest("GET", "/waitlist/" + fixture.waitlistId(), null);
        assertStatus(200, detailsResponse, "Creator must be able to view waitlist details");
        assertTrue(String.valueOf(detailsResponse.get("body")).contains(fixture.courseTitle()),
                "Waitlist details must include the waitlist course");
    }

    @Test
    void scenarioE_creatorCanManuallyStartClassFromOpenWaitlist() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Manual Start Course", 2);

        String token = login("creator1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded creator login must store access_token in localStorage");

        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);
        assertStatus(200, startResponse, "Creator must be able to manually start an eligible waitlist");

        Long classId = ((Number) responseDataObject(startResponse)).longValue();
        assertEquals("FULLED", waitlistStatus(fixture.waitlistId()),
                "Starting a class must fulfill the waitlist");
        assertTrue(countClassesForCourse(fixture.courseId()) > fixture.classCountBefore(),
                "Starting a class must create a running class");
        assertEquals(2, countLearnerClassMembers(classId),
                "Manual class start must enroll all eligible waitlist learners");
    }

    @Test
    void scenarioF_nonCreatorCannotStartClassFromWaitlist() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Non Creator Start Block Course", 2);

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);

        assertStatus(403, startResponse, "Learner must not be able to start a class from a waitlist");
        assertEquals("OPENING", waitlistStatus(fixture.waitlistId()),
                "Forbidden start attempt must keep waitlist opening");
        assertEquals(fixture.classCountBefore(), countClassesForCourse(fixture.courseId()),
                "Forbidden start attempt must not create a class");
    }

    @Test
    void scenarioG_learnerCannotLeaveFulfilledWaitlist() throws Exception {
        WaitlistMembershipFixture fixture = createOpenWaitlistWithLearnerFixture("learner1");

        login("learner2", SEEDED_PASSWORD);
        Map<String, Object> enrollResponse = apiRequest("POST", "/waitlist/enroll/" + fixture.courseId(), null);
        assertStatus(200, enrollResponse, "Second learner must be able to make waitlist eligible");

        logout();
        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);
        assertStatus(200, startResponse, "Creator must be able to fulfill the waitlist");

        logout();
        login("learner1", SEEDED_PASSWORD);
        Map<String, Object> leaveResponse = apiRequest("DELETE", "/waitlist/leave/" + fixture.courseId(), null);

        assertStatus(400, leaveResponse, "Learner must not leave a fulfilled waitlist");
        assertEquals("FULLED", waitlistStatus(fixture.waitlistId()),
                "Failed leave attempt must keep fulfilled waitlist status");
    }

    @Test
    void scenarioH_learnerCanViewWaitlistMembersAfterJoining() throws Exception {
        WaitlistMembershipFixture fixture = createOpenWaitlistWithLearnerFixture("learner1");

        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> membersResponse = apiRequest("GET", "/waitlist/members/" + fixture.courseId(), null);

        assertStatus(200, membersResponse, "Learner must be able to view waitlist members after joining");
        assertTrue(String.valueOf(membersResponse.get("body")).contains(String.valueOf(fixture.learnerId())),
                "Waitlist members must include the joined learner");
    }

    @Test
    void scenarioI_learnerCannotEnrollInRejectedOrPendingCourse() throws Exception {
        CourseReviewFixture pending = createPendingCourseFixture("System Pending Enrollment Block Course");
        CourseReviewFixture rejected = createPendingCourseFixture("System Rejected Enrollment Block Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest(
                        "PUT",
                        "/course/" + rejected.courseId() + "/reject",
                        Map.of("reason", "Enrollment should be blocked " + shortId())),
                "Admin must be able to prepare rejected enrollment fixture");

        logout();
        login("learner1", SEEDED_PASSWORD);

        Map<String, Object> pendingEnrollResponse = apiRequest(
                "POST",
                "/waitlist/enroll/" + pending.courseId(),
                null);
        Map<String, Object> rejectedEnrollResponse = apiRequest(
                "POST",
                "/waitlist/enroll/" + rejected.courseId(),
                null);

        assertStatus(400, pendingEnrollResponse, "Learner must not enroll in a pending course");
        assertStatus(400, rejectedEnrollResponse, "Learner must not enroll in a rejected course");
    }

    @Test
    void scenarioJ_creatorCannotStartClassWithLessThanTwoLearners() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Too Small Waitlist Course", 1);

        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);

        assertStatus(400, startResponse, "Creator must not start a class with fewer than two learners");
        assertEquals("OPENING", waitlistStatus(fixture.waitlistId()),
                "Too-small waitlist must remain opening");
        assertEquals(fixture.classCountBefore(), countClassesForCourse(fixture.courseId()),
                "Too-small waitlist must not create a class");
    }

    @Test
    void scenarioK_waitlistCapacityUsesTopTenLearnersOnly() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Top Ten Capacity Course", 11);

        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);
        assertStatus(200, startResponse, "Creator must be able to start an oversized waitlist");

        Long classId = ((Number) responseDataObject(startResponse)).longValue();
        assertEquals(10, countLearnerClassMembers(classId),
                "Class creation must enroll only the top ten waitlist learners");
        assertEquals(1, countOpenWaitlistEntries(fixture.waitlistId()),
                "Learners outside the top ten must remain outside the created class");
    }

    @Test
    void scenarioL_startClassCreatesStudyGroupsAndTimeline() throws Exception {
        OpenWaitlistFixture fixture = createOpenWaitlistFixture("System Class Structure Course", 4);

        login("creator1", SEEDED_PASSWORD);
        Map<String, Object> startResponse = apiRequest("POST", "/waitlist/start-class/" + fixture.waitlistId(), null);
        assertStatus(200, startResponse, "Creator must be able to start class structure fixture");

        Long classId = ((Number) responseDataObject(startResponse)).longValue();
        assertEquals(2, countStudyGroupsForClass(classId),
                "Starting a class with four learners must create paired study groups");
        assertEquals(countModulesForCourse(fixture.courseId()), countTimelineRowsForClass(classId),
                "Starting a class must create one timeline row per course module");
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
    private Object responseDataObject(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return body.get("data");
    }
}
