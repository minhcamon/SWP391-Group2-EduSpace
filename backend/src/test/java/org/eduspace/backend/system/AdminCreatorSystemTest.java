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

    @Test
    void scenarioE_adminCannotApproveAlreadyRejectedCourse() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Already Rejected Course");

        login("admin", SEEDED_PASSWORD);
        Map<String, Object> rejectResponse = apiRequest(
                "PUT",
                "/course/" + fixture.courseId() + "/reject",
                Map.of("reason", "Rejected before approve attempt " + shortId()));
        assertStatus(200, rejectResponse, "Admin must be able to prepare a rejected course");

        Map<String, Object> approveResponse = apiRequest("PUT", "/course/" + fixture.courseId() + "/approve", null);

        assertStatus(400, approveResponse, "Admin must not approve an already rejected course");
        assertEquals("REJECTED", courseStatus(fixture.courseId()),
                "Rejected course status must not change after an invalid approve attempt");
    }

    @Test
    void scenarioF_adminCannotRejectAlreadyApprovedCourse() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Already Approved Course");

        login("admin", SEEDED_PASSWORD);
        Map<String, Object> approveResponse = apiRequest("PUT", "/course/" + fixture.courseId() + "/approve", null);
        assertStatus(200, approveResponse, "Admin must be able to prepare an approved course");

        Map<String, Object> rejectResponse = apiRequest(
                "PUT",
                "/course/" + fixture.courseId() + "/reject",
                Map.of("reason", "Reject after approval should fail " + shortId()));

        assertStatus(400, rejectResponse, "Admin must not reject an already approved course");
        assertEquals("PUBLISHED", courseStatus(fixture.courseId()),
                "Approved course status must not change after an invalid reject attempt");
    }

    @Test
    void scenarioG_creatorCanSeeOwnCoursesAfterCreatingCourse() {
        login("creator1", SEEDED_PASSWORD);

        String title = "System Creator Own Course " + shortId();
        Map<String, Object> createResponse = createCourse(title, "Course should appear in creator list", "PENDING");
        assertStatus(200, createResponse, "Creator must be able to create a course");

        Map<String, Object> myCoursesResponse = apiRequest("GET", "/course/my-courses", null);

        assertStatus(200, myCoursesResponse, "Creator must be able to read own course list");
        assertTrue(String.valueOf(myCoursesResponse.get("body")).contains(title),
                "Creator course list must include the newly created course");
    }

    @Test
    void scenarioH_courseRequestHistoryIncludesApprovedAndRejectedActions() throws Exception {
        CourseReviewFixture approved = createPendingCourseFixture("System History Approved Course");
        CourseReviewFixture rejected = createPendingCourseFixture("System History Rejected Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest("PUT", "/course/" + approved.courseId() + "/approve", null),
                "Admin must be able to approve history fixture");
        assertStatus(200, apiRequest(
                        "PUT",
                        "/course/" + rejected.courseId() + "/reject",
                        Map.of("reason", "History rejection reason " + shortId())),
                "Admin must be able to reject history fixture");

        Map<String, Object> historyResponse = apiRequest("GET", "/course-requests/history", null);
        String historyBody = String.valueOf(historyResponse.get("body"));

        assertStatus(200, historyResponse, "Admin must be able to read course request history");
        assertTrue(historyBody.contains(approved.title()), "History must include the approved course");
        assertTrue(historyBody.contains("APPROVED"), "History must include approved actions");
        assertTrue(historyBody.contains(rejected.title()), "History must include the rejected course");
        assertTrue(historyBody.contains("REJECTED"), "History must include rejected actions");
    }

    @Test
    void scenarioI_creatorCanUpdateRejectedCourseBeforeResubmission() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Rejected Update Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest(
                        "PUT",
                        "/course/" + fixture.courseId() + "/reject",
                        Map.of("reason", "Needs edits before resubmission " + shortId())),
                "Admin must be able to prepare a rejected course");

        logout();
        login("creator1", SEEDED_PASSWORD);

        String updatedTitle = "System Resubmitted Course " + shortId();
        Map<String, Object> updateResponse = apiRequest(
                "PUT",
                "/course/" + fixture.courseId() + "/update",
                Map.of(
                        "title", updatedTitle,
                        "description", "Updated after admin rejection",
                        "status", "PENDING"));

        assertStatus(200, updateResponse, "Creator must be able to edit and resubmit a rejected course");
        assertEquals(updatedTitle, courseTitle(fixture.courseId()), "Rejected course title must be updated");
        assertEquals("PENDING", courseStatus(fixture.courseId()),
                "Rejected course must be moved back to PENDING for admin review");
    }

    @Test
    void scenarioJ_creatorCannotUpdatePublishedCourse() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Published Update Block Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest("PUT", "/course/" + fixture.courseId() + "/approve", null),
                "Admin must be able to publish the fixture course");

        logout();
        login("creator1", SEEDED_PASSWORD);

        Map<String, Object> updateResponse = apiRequest(
                "PUT",
                "/course/" + fixture.courseId() + "/update",
                Map.of(
                        "title", "Invalid Published Update " + shortId(),
                        "description", "Published courses should not be edited",
                        "status", "PENDING"));

        assertStatus(400, updateResponse, "Creator must not update a published course");
        assertEquals("PUBLISHED", courseStatus(fixture.courseId()),
                "Published course status must not change after invalid update");
    }

    @Test
    void scenarioK_adminCanSeeOnlyPendingCoursesInPendingList() throws Exception {
        CourseReviewFixture pending = createPendingCourseFixture("System Pending Visible Course");
        CourseReviewFixture approved = createPendingCourseFixture("System Pending Hidden Approved Course");
        CourseReviewFixture rejected = createPendingCourseFixture("System Pending Hidden Rejected Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest("PUT", "/course/" + approved.courseId() + "/approve", null),
                "Admin must be able to publish hidden fixture");
        assertStatus(200, apiRequest(
                        "PUT",
                        "/course/" + rejected.courseId() + "/reject",
                        Map.of("reason", "Hidden from pending list " + shortId())),
                "Admin must be able to reject hidden fixture");

        Map<String, Object> pendingResponse = apiRequest("GET", "/course/pending", null);
        String body = String.valueOf(pendingResponse.get("body"));

        assertStatus(200, pendingResponse, "Admin must be able to read pending courses");
        assertTrue(body.contains(pending.title()), "Pending list must include pending courses");
        assertFalse(body.contains(approved.title()), "Pending list must not include published courses");
        assertFalse(body.contains(rejected.title()), "Pending list must not include rejected courses");
    }

    @Test
    void scenarioL_publicCatalogOnlyShowsPublishedCourses() throws Exception {
        CourseReviewFixture pending = createPendingCourseFixture("System Catalog Hidden Pending Course");
        CourseReviewFixture published = createPendingCourseFixture("System Catalog Visible Published Course");
        CourseReviewFixture rejected = createPendingCourseFixture("System Catalog Hidden Rejected Course");

        login("admin", SEEDED_PASSWORD);
        assertStatus(200, apiRequest("PUT", "/course/" + published.courseId() + "/approve", null),
                "Admin must be able to publish catalog fixture");
        assertStatus(200, apiRequest(
                        "PUT",
                        "/course/" + rejected.courseId() + "/reject",
                        Map.of("reason", "Hidden from public catalog " + shortId())),
                "Admin must be able to reject catalog fixture");

        Map<String, Object> publicResponse = apiRequest("GET", "/course/all?page=0&size=200", null);
        String body = String.valueOf(publicResponse.get("body"));

        assertStatus(200, publicResponse, "Public catalog endpoint must be readable");
        assertTrue(body.contains(published.title()), "Public catalog must include published courses");
        assertFalse(body.contains(pending.title()), "Public catalog must not include pending courses");
        assertFalse(body.contains(rejected.title()), "Public catalog must not include rejected courses");
    }

    @Test
    void scenarioM_creatorCannotDeleteCourseOwnedByAnotherCreator() throws Exception {
        CourseReviewFixture fixture = createPendingCourseFixture("System Other Creator Delete Block Course");
        TestUser otherCreator = register("othercreator");
        setRole(otherCreator.username(), "CREATOR");

        login(otherCreator.username());
        Map<String, Object> deleteResponse = apiRequest("DELETE", "/course/" + fixture.courseId() + "/delete", null);

        assertStatus(400, deleteResponse, "Creator must not delete a course owned by another creator");
        assertFalse(courseIsDeleted(fixture.courseId()),
                "Course must remain undeleted after another creator's delete attempt");
    }

    private void assertStatus(int expectedStatus, Map<String, Object> response, String message) {
        assertEquals(expectedStatus, ((Number) response.get("status")).intValue(), message);
    }

    private Map<String, Object> createCourse(String title, String description, String status) {
        return apiRequest(
                "POST",
                "/course/create-course",
                Map.of(
                        "title", title,
                        "description", description,
                        "status", status));
    }

    @SuppressWarnings("unchecked")
    private Object responseData(Map<String, Object> response) {
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        return body.get("data");
    }
}
