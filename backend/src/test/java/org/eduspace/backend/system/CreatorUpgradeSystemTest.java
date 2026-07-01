package org.eduspace.backend.system;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 6: Learner account upgrade to Creator. */
class CreatorUpgradeSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_learnerRequestsCreatorUpgradeAndAdminApprovesIt() throws Exception {
        TestUser learner = register("upgrade");
        TestUser admin = register("upgradeadmin");
        setRole(admin.username(), "ADMIN");

        String learnerToken = login(learner.username());
        String adminToken = login(admin.username());
        request("POST", "/creator-requests/send", null, learnerToken, 200);

        JsonNode pending = request("GET", "/creator-requests/pending", null, adminToken, 200).path("data");
        long requestId = findRequestIdByEmail(pending, learner.email());
        assertTrue(requestId > 0, "Admin must see the learner's pending upgrade request");

        JsonNode approval = request("PUT", "/creator-requests/" + requestId + "/approved",
                null, adminToken, 200);
        assertEquals("APPROVED", approval.path("data").path("status").asText());

        String refreshedToken = login(learner.username());
        JsonNode profile = request("GET", "/user/profile", null, refreshedToken, 200).path("data");
        assertEquals("CREATOR", profile.path("role").asText());
    }

    @Test
    void scenarioB_unauthenticatedUserCannotSendUpgradeRequest() throws Exception {
        request("POST", "/creator-requests/send", null, null, 401);
    }

    @Test
    void scenarioB_creatorCannotSendLearnerUpgradeRequest() throws Exception {
        TestUser creator = register("alreadycreator");
        setRole(creator.username(), "CREATOR");
        String creatorToken = login(creator.username());

        request("POST", "/creator-requests/send", null, creatorToken, 403);
    }

    @Test
    void scenarioC_duplicatePendingRequestIsRejected() throws Exception {
        TestUser learner = register("doubleupgrade");
        String token = login(learner.username());

        request("POST", "/creator-requests/send", null, token, 200);
        request("POST", "/creator-requests/send", null, token, 400);
    }

    @Test
    void scenarioC_learnerCannotApproveOwnUpgradeRequest() throws Exception {
        TestUser learner = register("selfapprove");
        String token = login(learner.username());
        request("POST", "/creator-requests/send", null, token, 200);

        request("PUT", "/creator-requests/999999999/approved", null, token, 403);
    }
}
