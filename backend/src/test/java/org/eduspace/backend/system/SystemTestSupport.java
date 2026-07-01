package org.eduspace.backend.system;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

abstract class SystemTestSupport {

    protected static final ObjectMapper JSON = new ObjectMapper();
    protected static final String PASSWORD = "Test@1234";

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    private final String apiUrl = setting("system.test.api-url", "SYSTEM_TEST_API_URL",
            "http://localhost:8080/api");
    private final String dbUrl = setting("system.test.db-url", "SYSTEM_TEST_DB_URL",
            "jdbc:mysql://localhost:3306/swp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private final String dbUsername = setting("system.test.db-username", "SYSTEM_TEST_DB_USERNAME", "root");
    private final String dbPassword = setting("system.test.db-password", "SYSTEM_TEST_DB_PASSWORD", "123456");

    protected TestUser register(String prefix) throws Exception {
        String username = prefix + shortId();
        String email = username + "@example.com";
        JsonNode body = JSON.createObjectNode()
                .put("fullName", "System Test User")
                .put("username", username)
                .put("email", email)
                .put("password", PASSWORD)
                .put("phone", "0123456789");
        request("POST", "/auth/register", body, null, 200);
        return new TestUser(username, email);
    }

    protected String login(String username) throws Exception {
        JsonNode response = request("POST", "/auth/login", JSON.createObjectNode()
                .put("usernameOrEmail", username)
                .put("password", PASSWORD), null, 200);
        String token = response.path("data").path("token").asText();
        assertTrue(!token.isBlank(), "Login response must contain a JWT");
        return token;
    }

    protected void setRole(String username, String role) throws Exception {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET role = ? WHERE username = ?")) {
            statement.setString(1, role);
            statement.setString(2, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be promoted");
        }
    }

    protected JsonNode request(String method, String path, JsonNode body, String token, int expectedStatus)
            throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(apiUrl + path))
                .timeout(Duration.ofSeconds(15))
                .header("Accept", "application/json");
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (body != null) builder.header("Content-Type", "application/json");
        builder.method(method, body == null
                ? HttpRequest.BodyPublishers.noBody()
                : HttpRequest.BodyPublishers.ofString(JSON.writeValueAsString(body)));

        HttpResponse<String> response = HTTP.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(expectedStatus, response.statusCode(),
                () -> method + " " + path + " returned: " + response.body());
        return response.body().isBlank() ? JSON.createObjectNode() : JSON.readTree(response.body());
    }

    protected boolean containsId(JsonNode array, long id) {
        for (JsonNode item : array) {
            if (item.path("id").asLong() == id) return true;
        }
        return false;
    }

    protected long findRequestIdByEmail(JsonNode array, String email) {
        for (JsonNode item : array) {
            if (email.equals(item.path("learnerEmail").asText())) {
                return item.path("requestId").asLong();
            }
        }
        return -1;
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private static String setting(String property, String environment, String defaultValue) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) value = System.getenv(environment);
        return value == null || value.isBlank() ? defaultValue : value.replaceAll("/+$", "");
    }

    protected record TestUser(String username, String email) {}
}
