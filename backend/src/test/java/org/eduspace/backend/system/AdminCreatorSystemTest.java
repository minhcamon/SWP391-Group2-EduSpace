package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 2: Creator course submission and Admin course review using API calls. */
@EnabledIfSystemProperty(named = "system.test.enabled", matches = "true")
class AdminCreatorSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_creatorCanCreatePendingCourseAndAdminCanApproveIt() throws Exception {
        String token = login("creator1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded creator login must store access_token in localStorage");

        String title = "System Creator Pending Course " + shortId();
        Map<String, Object> createResponse = apiRequest(
                "POST",
                "/course/create-course",
                Map.of(
                        "title", title,
                        "description", "Course created by a system workflow test",
                        "status", "PENDING"));
        assertStatus(200, createResponse, "Creator must be able to create a pending course");

        Long courseId = ((Number) responseData(createResponse)).longValue();
        assertEquals("PENDING", courseStatus(courseId), "New creator course must wait for admin review");

        logout();
        login("admin", SEEDED_PASSWORD);

        Map<String, Object> pendingResponse = apiRequest("GET", "/course/pending", null);
        assertStatus(200, pendingResponse, "Admin must be able to see pending courses");
        assertTrue(String.valueOf(pendingResponse.get("body")).contains(title),
                "Pending course list must include the creator-created course");

        Map<String, Object> approveResponse = apiRequest("PUT", "/course/" + courseId + "/approve", null);
        assertStatus(200, approveResponse, "Admin must be able to approve a pending course");

        assertEquals("PUBLISHED", courseStatus(courseId), "Approved course must become published");
        assertTrue(countCourseRequests(courseId, "APPROVED") > 0,
                "Approving a course must create an approved course request history row");

        Map<String, Object> publicCoursesResponse = apiRequest("GET", "/course/all?page=0&size=100", null);
        assertStatus(200, publicCoursesResponse, "Published courses endpoint must remain readable");
        assertTrue(String.valueOf(publicCoursesResponse.get("body")).contains(title),
                "Approved course must be visible in the public course catalog");
    }

    @Test
    void scenarioB_adminCanRejectPendingCourseWithReason() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Admin Reject Course");

        String token = login("admin", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded admin login must store access_token in localStorage");

        Map<String, Object> rejectResponse = apiRequest(
                "PUT",
                "/course/" + fixture.courseId() + "/reject",
                Map.of("reason", "System test rejection reason " + shortId()));

        assertStatus(200, rejectResponse, "Admin must be able to reject a pending course");
        assertEquals("REJECTED", courseStatus(fixture.courseId()), "Rejected course must move to REJECTED");
        assertTrue(countCourseRequests(fixture.courseId(), "REJECTED") > 0,
                "Rejecting a course must create a rejected course request history row");
        assertTrue(countNotificationsForCourse(fixture.courseId()) > 0,
                "Rejecting a course must notify the creator");
    }

    @Test
    void scenarioC_nonAdminUsersCannotOpenAdminCourseReviewApis() {
        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> learnerPendingResponse = apiRequest("GET", "/course/pending", null);
        assertEquals(403, ((Number) learnerPendingResponse.get("status")).intValue(),
                "Learner must not read admin pending course review API");

        logout();
        login("creator1", SEEDED_PASSWORD);

        Map<String, Object> creatorPendingResponse = apiRequest("GET", "/course/pending", null);
        assertEquals(403, ((Number) creatorPendingResponse.get("status")).intValue(),
                "Creator must not read admin pending course review API");
    }

    @Test
    void scenarioD_nonCreatorUsersCannotCreateCourses() {
        String token = login("learner1", SEEDED_PASSWORD);
        assertFalse(token.isBlank(), "Seeded learner login must store access_token in localStorage");

        Map<String, Object> learnerCreateResponse = apiRequest(
                "POST",
                "/course/create-course",
                Map.of(
                        "title", "Learner forbidden course " + shortId(),
                        "description", "Learner should not be allowed to create courses",
                        "status", "PENDING"));

        assertEquals(403, ((Number) learnerCreateResponse.get("status")).intValue(),
                "Learner must not create courses through creator API");

        logout();
        login("admin", SEEDED_PASSWORD);

        Map<String, Object> adminCreateResponse = apiRequest(
                "POST",
                "/course/create-course",
                Map.of(
                        "title", "Admin forbidden creator course " + shortId(),
                        "description", "Admin should review courses, not use creator create API",
                        "status", "PENDING"));

        assertEquals(403, ((Number) adminCreateResponse.get("status")).intValue(),
                "Admin must not create courses through creator-only API");
    }

    private void assertStatus(int expectedStatus, Map<String, Object> response, String message) {
        assertEquals(expectedStatus, ((Number) response.get("status")).intValue(), message);
    }

    @SuppressWarnings("unchecked")
    private Object responseData(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return body.get("data");
    }
}
