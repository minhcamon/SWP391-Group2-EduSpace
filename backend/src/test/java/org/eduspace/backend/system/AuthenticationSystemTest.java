package org.eduspace.backend.system;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Workflow 1: User onboarding and authentication. */
class AuthenticationSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_userCanRegisterLoginAndReadProfile() throws Exception {
        TestUser learner = register("learner");
        String token = login(learner.username());

        JsonNode profile = request("GET", "/user/profile", null, token, 200).path("data");
        assertEquals(learner.username(), profile.path("username").asText());
        assertEquals(learner.email(), profile.path("email").asText());
        assertEquals("LEARNER", profile.path("role").asText());
    }

    @Test
    void scenarioB_loginWithWrongPasswordIsRejected() throws Exception {
        TestUser learner = register("wrongpass");

        JsonNode body = JSON.createObjectNode()
                .put("usernameOrEmail", learner.username())
                .put("password", "Wrong@1234");
        JsonNode response = request("POST", "/auth/login", body, null, 400);

        assertEquals(false, response.path("success").asBoolean());
    }

    @Test
    void scenarioB_registrationWithInvalidEmailIsRejected() throws Exception {
        JsonNode body = JSON.createObjectNode()
                .put("fullName", "Invalid Email User")
                .put("username", "invalid" + shortId())
                .put("email", "not-an-email")
                .put("password", PASSWORD)
                .put("phone", "0123456789");

        request("POST", "/auth/register", body, null, 400);
    }

    @Test
    void scenarioC_duplicateUsernameIsRejected() throws Exception {
        TestUser original = register("duplicate");
        JsonNode duplicate = JSON.createObjectNode()
                .put("fullName", "Duplicate User")
                .put("username", original.username())
                .put("email", "other" + shortId() + "@example.com")
                .put("password", PASSWORD)
                .put("phone", "0123456789");

        request("POST", "/auth/register", duplicate, null, 400);
    }

    @Test
    void scenarioC_profileWithoutTokenIsRejected() throws Exception {
        request("GET", "/user/profile", null, null, 401);
    }
}
