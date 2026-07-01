package org.eduspace.backend.system;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 2: Course creation and approval lifecycle. */
class CourseApprovalSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_creatorCreatesPendingCourseAndAdminPublishesIt() throws Exception {
        TestUser creator = register("creator");
        TestUser admin = register("admin");
        setRole(creator.username(), "CREATOR");
        setRole(admin.username(), "ADMIN");

        String creatorToken = login(creator.username());
        String adminToken = login(admin.username());
        String title = "System Test Course " + shortId();
        JsonNode created = request("POST", "/course/create-course", JSON.createObjectNode()
                .put("title", title)
                .put("description", "Course created by an end-to-end workflow test")
                .put("status", "PENDING")
                .set("modules", JSON.createArrayNode()), creatorToken, 200);
        long courseId = created.path("data").asLong();
        assertTrue(courseId > 0);

        JsonNode pending = request("GET", "/course/pending", null, adminToken, 200).path("data");
        assertTrue(containsId(pending, courseId), "Admin must see the submitted course");

        JsonNode approved = request("PUT", "/course/" + courseId + "/approve", null, adminToken, 200);
        assertEquals("PUBLISHED", approved.path("data").path("status").asText());

        JsonNode publicCourse = request("GET", "/course/" + courseId, null, null, 200);
        assertEquals(title, publicCourse.path("data").path("title").asText());
        assertEquals("PUBLISHED", publicCourse.path("data").path("status").asText());
    }

    @Test
    void scenarioB_learnerCannotCreateCourse() throws Exception {
        TestUser learner = register("courselearner");
        String learnerToken = login(learner.username());

        JsonNode course = courseBody("Unauthorized course", "PENDING");
        request("POST", "/course/create-course", course, learnerToken, 403);
    }

    @Test
    void scenarioB_invalidCourseStatusIsRejected() throws Exception {
        TestUser creator = register("badcourse");
        setRole(creator.username(), "CREATOR");
        String creatorToken = login(creator.username());

        request("POST", "/course/create-course",
                courseBody("Invalid status course", "NOT_A_STATUS"), creatorToken, 400);
    }

    @Test
    void scenarioC_creatorCannotUseAdminApprovalEndpoint() throws Exception {
        TestUser creator = register("securecourse");
        setRole(creator.username(), "CREATOR");
        String creatorToken = login(creator.username());

        JsonNode created = request("POST", "/course/create-course",
                courseBody("Security course " + shortId(), "PENDING"), creatorToken, 200);
        long courseId = created.path("data").asLong();

        request("PUT", "/course/" + courseId + "/approve", null, creatorToken, 403);
    }

    @Test
    void scenarioC_pendingCourseIsNotPubliclyAccessible() throws Exception {
        TestUser creator = register("pendingcourse");
        setRole(creator.username(), "CREATOR");
        String creatorToken = login(creator.username());

        long courseId = request("POST", "/course/create-course",
                courseBody("Private pending course " + shortId(), "PENDING"), creatorToken, 200)
                .path("data").asLong();

        request("GET", "/course/" + courseId, null, null, 400);
    }

    private JsonNode courseBody(String title, String status) {
        return JSON.createObjectNode()
                .put("title", title)
                .put("description", "System test course")
                .put("status", status)
                .set("modules", JSON.createArrayNode());
    }
}
