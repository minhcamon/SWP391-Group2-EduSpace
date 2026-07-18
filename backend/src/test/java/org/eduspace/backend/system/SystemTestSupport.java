package org.eduspace.backend.system;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

abstract class SystemTestSupport {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;

    protected static final String PASSWORD = "Test@1234";
    protected static final String SEEDED_PASSWORD = "password123";

    private final String dbUrl = setting("system.test.db-url", "SYSTEM_TEST_DB_URL",
            "jdbc:mysql://localhost:3306/swp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private final String dbUsername = setting("system.test.db-username", "SYSTEM_TEST_DB_USERNAME", "root");
    private final String dbPassword = setting("system.test.db-password", "SYSTEM_TEST_DB_PASSWORD", "123456");

    @BeforeEach
    void setUp() {
        baseUrl = setting("system.test.base-url", "SYSTEM_TEST_BASE_URL", "http://localhost:5173");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");
        options.addArguments("--headless=new");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected TestUser register(String prefix) {
        String username = prefix + shortId();
        String email = username + "@example.com";

        driver.get(baseUrl + "/signup");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

        driver.findElement(By.id("fullname")).sendKeys("System Test User");
        driver.findElement(By.id("phone")).sendKeys("0123456789");
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(PASSWORD);
        driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
        driver.findElement(By.id("terms")).click();
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.urlContains("/login"));

        return new TestUser(username, email);
    }

    protected String login(String username) {
        return login(username, PASSWORD);
    }

    protected String login(String username, String password) {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));

        Object token = ((JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('access_token');");

        return token != null ? token.toString() : "";
    }

    protected void enableMentorMode() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.setItem('currentMode', 'MENTOR');");
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

    protected MentorFixture loadMentorFixture(String username) throws Exception {
        String sql = """
                SELECT
                    cls.class_id,
                    cls.name AS class_name,
                    c.title AS course_title,
                    sg.study_group_id,
                    i.id AS incident_id
                FROM users u
                JOIN class_members cm ON cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN study_groups sg ON sg.class_id = cls.class_id
                LEFT JOIN incidents i ON i.reporter_id IN (
                    SELECT learner.id
                    FROM class_members learner
                    WHERE learner.class_id = cls.class_id
                      AND learner.context_role = 'LEARNER'
                )
                WHERE u.username = ?
                  AND cm.context_role = 'MENTOR'
                ORDER BY cls.class_id, sg.study_group_id, i.id
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded mentor fixture to exist for " + username);

                Long incidentId = resultSet.getObject("incident_id", Long.class);
                assertNotNull(incidentId, "Expected the mentor fixture to include a seeded incident");

                return new MentorFixture(
                        resultSet.getLong("class_id"),
                        resultSet.getString("class_name"),
                        resultSet.getString("course_title"),
                        resultSet.getLong("study_group_id"),
                        incidentId);
            }
        }
    }

    protected ArbitrationFixture createPendingArbitrationFixture(String username) throws Exception {
        String fixtureSql = """
                SELECT
                    cls.class_id,
                    cls.name AS class_name,
                    c.title AS course_title,
                    reporter.id AS reporter_member_id,
                    reporter_user.fullname AS reporter_name,
                    reported.id AS reported_member_id,
                    a.assignment_id,
                    a.title AS assignment_title
                FROM users u
                JOIN class_members mentor_cm ON mentor_cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = mentor_cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN class_members reporter ON reporter.class_id = cls.class_id
                    AND reporter.context_role = 'LEARNER'
                JOIN users reporter_user ON reporter_user.user_id = reporter.user_id
                JOIN class_members reported ON reported.class_id = cls.class_id
                    AND reported.context_role = 'LEARNER'
                    AND reported.id <> reporter.id
                JOIN modules m ON m.course_id = c.course_id
                JOIN assignments a ON a.module_id = m.module_id
                WHERE u.username = ?
                  AND mentor_cm.context_role = 'MENTOR'
                ORDER BY reporter.id, reported.id, a.assignment_id
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement fixtureStatement = connection.prepareStatement(fixtureSql)) {
            fixtureStatement.setString(1, username);

            try (ResultSet resultSet = fixtureStatement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded mentor arbitration fixture to exist for " + username);

                Long submissionId = insertSubmission(
                        connection,
                        resultSet.getLong("assignment_id"),
                        resultSet.getLong("reporter_member_id"));
                Long incidentId = insertArbitrationIncident(
                        connection,
                        submissionId,
                        resultSet.getLong("reporter_member_id"),
                        resultSet.getLong("reported_member_id"));

                return new ArbitrationFixture(
                        incidentId,
                        resultSet.getString("class_name"),
                        resultSet.getString("course_title"),
                        resultSet.getString("assignment_title"),
                        resultSet.getString("reporter_name"));
            }
        }
    }

    protected LearningFixture loadLearningFixture(String username) throws Exception {
        String sql = """
                SELECT
                    u.user_id,
                    cm.id AS member_id,
                    cls.class_id,
                    c.course_id,
                    c.title AS course_title,
                    l.title AS lesson_title,
                    a.assignment_id,
                    a.title AS assignment_title
                FROM users u
                JOIN class_members cm ON cm.user_id = u.user_id
                JOIN classes cls ON cls.class_id = cm.class_id
                JOIN courses c ON c.course_id = cls.course_id
                JOIN modules m ON m.course_id = c.course_id
                JOIN lessons l ON l.module_id = m.module_id
                JOIN assignments a ON a.module_id = m.module_id
                WHERE u.username = ?
                  AND cm.context_role = 'LEARNER'
                ORDER BY m.sort_order DESC, l.sort_order
                LIMIT 1
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded learning fixture to exist for " + username);

                return new LearningFixture(
                        resultSet.getLong("user_id"),
                        resultSet.getLong("member_id"),
                        resultSet.getLong("class_id"),
                        resultSet.getLong("course_id"),
                        resultSet.getString("course_title"),
                        resultSet.getString("lesson_title"),
                        resultSet.getLong("assignment_id"),
                        resultSet.getString("assignment_title"));
            }
        }
    }

    protected LearningWorkflowFixture prepareLearningWorkflowFixture(
            String learnerUsername,
            String reviewerUsername) throws Exception {
        LearningFixture learner = loadLearningFixture(learnerUsername);
        LearningFixture reviewer = loadLearningFixture(reviewerUsername);

        assertEquals(learner.classId(), reviewer.classId(), "Workflow learners must be in the same class");
        assertEquals(learner.assignmentId(), reviewer.assignmentId(), "Workflow learners must use the same assignment");

        resetAssignmentSubmissions(learner.assignmentId(), learner.memberId(), reviewer.memberId());

        return new LearningWorkflowFixture(learner, reviewer);
    }

    protected MentorIncidentFixture createPendingMentorIncidentFixture(
            String mentorUsername,
            String incidentType,
            String reason) throws Exception {
        String fixtureSql = """
                SELECT
                    reporter.id AS reporter_member_id,
                    reported.id AS reported_member_id
                FROM users mentor_user
                JOIN class_members mentor_cm ON mentor_cm.user_id = mentor_user.user_id
                JOIN class_members reporter ON reporter.class_id = mentor_cm.class_id
                    AND reporter.context_role = 'LEARNER'
                JOIN class_members reported ON reported.class_id = mentor_cm.class_id
                    AND reported.context_role = 'LEARNER'
                    AND reported.id <> reporter.id
                WHERE mentor_user.username = ?
                  AND mentor_cm.context_role = 'MENTOR'
                ORDER BY reporter.id, reported.id
                LIMIT 1
                """;
        String insertSql = """
                INSERT INTO incidents
                    (incident_type, reporter_id, reported_id, reason, evidence_url, status, created_at)
                VALUES
                    (?, ?, ?, ?, NULL, 'PENDING', NOW())
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement fixtureStatement = connection.prepareStatement(fixtureSql)) {
            fixtureStatement.setString(1, mentorUsername);

            try (ResultSet resultSet = fixtureStatement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected learner pair fixture for mentor " + mentorUsername);

                try (PreparedStatement insertStatement = connection.prepareStatement(
                        insertSql,
                        Statement.RETURN_GENERATED_KEYS)) {
                    insertStatement.setString(1, incidentType);
                    insertStatement.setLong(2, resultSet.getLong("reporter_member_id"));
                    insertStatement.setLong(3, resultSet.getLong("reported_member_id"));
                    insertStatement.setString(4, reason);
                    insertStatement.executeUpdate();

                    try (ResultSet keys = insertStatement.getGeneratedKeys()) {
                        assertTrue(keys.next(), "Expected generated incident id");
                        return new MentorIncidentFixture(keys.getLong(1), reason);
                    }
                }
            }
        }
    }

    protected EnrollmentFixture createNearlyFullWaitlistFixture(String finalLearnerUsername) throws Exception {
        String suffix = shortId();
        Long finalLearnerId = findUserId(finalLearnerUsername);

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            Long courseId = insertSystemEnrollmentCourse(connection, suffix);
            insertSystemEnrollmentModule(connection, courseId);
            Long waitlistId = insertSystemEnrollmentWaitlist(connection, courseId);

            for (int i = 0; i < 9; i++) {
                Long userId = insertSystemEnrollmentUser(connection, suffix, i);
                insertSystemEnrollmentWaitlistEntry(connection, waitlistId, userId, i);
            }

            return new EnrollmentFixture(
                    courseId,
                    waitlistId,
                    finalLearnerId,
                    countClassesForCourse(courseId),
                    countClassMembershipsForCourseAndUser(courseId, finalLearnerId));
        }
    }

    protected String waitlistStatus(Long waitlistId) throws Exception {
        String sql = "SELECT status FROM waitlists WHERE wait_list_id = ?";
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, waitlistId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected waitlist to exist");
                return resultSet.getString("status");
            }
        }
    }

    protected int countClassesForCourse(Long courseId) throws Exception {
        String sql = "SELECT COUNT(*) FROM classes WHERE course_id = ?";
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, courseId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected class count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected int countClassMembershipsForCourseAndUser(Long courseId, Long userId) throws Exception {
        String sql = """
                SELECT COUNT(*)
                FROM class_members cm
                JOIN classes c ON c.class_id = cm.class_id
                WHERE c.course_id = ?
                  AND cm.user_id = ?
                  AND cm.context_role = 'LEARNER'
                """;
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, courseId);
            statement.setLong(2, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected class membership count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected int countOpenWaitlistEntries(Long waitlistId) throws Exception {
        String sql = "SELECT COUNT(*) FROM waitlist_entries WHERE waitlist_id = ?";
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, waitlistId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected waitlist entry count result");
                return resultSet.getInt(1);
            }
        }
    }

    private Long findUserId(String username) throws Exception {
        String sql = "SELECT user_id FROM users WHERE username = ?";
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded user to exist: " + username);
                return resultSet.getLong("user_id");
            }
        }
    }

    private Long insertSystemEnrollmentCourse(Connection connection, String suffix) throws Exception {
        String sql = """
                INSERT INTO courses (title, description, status, created_at, is_deleted)
                VALUES (?, ?, 'PUBLISHED', NOW(), false)
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, "System Enrollment Course " + suffix);
            statement.setString(2, "Course generated for waitlist system workflow testing");
            statement.executeUpdate();
            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated course id");
                return keys.getLong(1);
            }
        }
    }

    private void insertSystemEnrollmentModule(Connection connection, Long courseId) throws Exception {
        String sql = """
                INSERT INTO modules
                    (title, priority, days, base_exp, speed_bonus_exp, sort_order, course_id)
                VALUES
                    ('System Enrollment Module', 'LOW', 7, 10, 5, 1, ?)
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, courseId);
            statement.executeUpdate();
        }
    }

    private Long insertSystemEnrollmentWaitlist(Connection connection, Long courseId) throws Exception {
        String sql = """
                INSERT INTO waitlists (course_id, created_at, status)
                VALUES (?, NOW(), 'OPENING')
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, courseId);
            statement.executeUpdate();
            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated waitlist id");
                return keys.getLong(1);
            }
        }
    }

    private Long insertSystemEnrollmentUser(Connection connection, String suffix, int index) throws Exception {
        String username = "system_wait_" + suffix + "_" + index;
        String sql = """
                INSERT INTO users
                    (fullname, username, password, email, role, status, auth_provider, created_at, total_exp)
                VALUES
                    (?, ?, 'not-used', ?, 'LEARNER', 'ACTIVE', 'LOCAL', NOW(), ?)
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, "System Waitlist User " + index);
            statement.setString(2, username);
            statement.setString(3, username + "@example.com");
            statement.setInt(4, index * 10);
            statement.executeUpdate();
            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated waitlist user id");
                return keys.getLong(1);
            }
        }
    }

    private void insertSystemEnrollmentWaitlistEntry(
            Connection connection,
            Long waitlistId,
            Long userId,
            int offsetMinutes) throws Exception {
        String sql = """
                INSERT INTO waitlist_entries (waitlist_id, user_id, enrolled_at)
                VALUES (?, ?, DATE_SUB(NOW(), INTERVAL ? MINUTE))
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, waitlistId);
            statement.setLong(2, userId);
            statement.setInt(3, 30 - offsetMinutes);
            statement.executeUpdate();
        }
    }

    private void resetAssignmentSubmissions(Long assignmentId, Long firstMemberId, Long secondMemberId) throws Exception {
        String deletePeerReviewsSql = """
                DELETE pr
                FROM peer_reviews pr
                JOIN submissions s ON s.submission_id = pr.submission_id
                WHERE s.assignment_id = ?
                  AND s.learner_id IN (?, ?)
                """;
        String deleteSubmissionsSql = """
                DELETE FROM submissions
                WHERE assignment_id = ?
                  AND learner_id IN (?, ?)
                """;

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            try (PreparedStatement statement = connection.prepareStatement(deletePeerReviewsSql)) {
                statement.setLong(1, assignmentId);
                statement.setLong(2, firstMemberId);
                statement.setLong(3, secondMemberId);
                statement.executeUpdate();
            }
            try (PreparedStatement statement = connection.prepareStatement(deleteSubmissionsSql)) {
                statement.setLong(1, assignmentId);
                statement.setLong(2, firstMemberId);
                statement.setLong(3, secondMemberId);
                statement.executeUpdate();
            }
        }
    }

    @SuppressWarnings("unchecked")
    protected Map<String, Object> apiRequest(String method, String path, Object body) {
        Object response = ((JavascriptExecutor) driver).executeAsyncScript("""
                const method = arguments[0];
                const path = arguments[1];
                const body = arguments[2];
                const done = arguments[arguments.length - 1];
                const token = window.localStorage.getItem('access_token');
                fetch('/api' + path, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: 'Bearer ' + token } : {})
                    },
                    body: body == null ? undefined : JSON.stringify(body)
                })
                    .then(async (res) => {
                        const text = await res.text();
                        let parsed = null;
                        try {
                            parsed = text ? JSON.parse(text) : null;
                        } catch {
                            parsed = text;
                        }
                        done({ ok: res.ok, status: res.status, body: parsed });
                    })
                    .catch((error) => done({ ok: false, status: 0, error: String(error) }));
                """, method, path, body);

        return (Map<String, Object>) response;
    }

    private Long insertSubmission(Connection connection, Long assignmentId, Long learnerMemberId) throws Exception {
        String sql = """
                INSERT INTO submissions (assignment_id, learner_id, submission_content, submitted_at, status)
                VALUES (?, ?, ?, NOW(), 'PENDING')
                """;

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, assignmentId);
            statement.setLong(2, learnerMemberId);
            statement.setString(3, "System test arbitration submission " + shortId());
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated submission id");
                return keys.getLong(1);
            }
        }
    }

    private Long insertArbitrationIncident(
            Connection connection,
            Long submissionId,
            Long reporterMemberId,
            Long reportedMemberId) throws Exception {
        String sql = """
                INSERT INTO incidents
                    (incident_type, submission_id, reporter_id, reported_id, reason, evidence_url, status, created_at)
                VALUES
                    ('PEER_REVIEW_DISPUTE', ?, ?, ?, ?, NULL, 'PENDING', NOW())
                """;

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, submissionId);
            statement.setLong(2, reporterMemberId);
            statement.setLong(3, reportedMemberId);
            statement.setString(4, "System test arbitration needs mentor grading " + shortId());
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                assertTrue(keys.next(), "Expected generated arbitration incident id");
                return keys.getLong(1);
            }
        }
    }

    protected String getCurrentPath() {
        return URI.create(driver.getCurrentUrl()).getPath();
    }

    protected void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login");
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private static String setting(String property, String environment, String defaultValue) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) {
            value = System.getenv(environment);
        }
        return value == null || value.isBlank() ? defaultValue : value.replaceAll("/+$", "");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected record TestUser(String username, String email) {}

    protected record MentorFixture(
            Long classId,
            String className,
            String courseTitle,
            Long studyGroupId,
            Long incidentId) {}

    protected record ArbitrationFixture(
            Long incidentId,
            String className,
            String courseTitle,
            String assignmentTitle,
            String reporterName) {}

    protected record LearningFixture(
            Long userId,
            Long memberId,
            Long classId,
            Long courseId,
            String courseTitle,
            String lessonTitle,
            Long assignmentId,
            String assignmentTitle) {}

    protected record LearningWorkflowFixture(
            LearningFixture learner,
            LearningFixture reviewer) {}

    protected record MentorIncidentFixture(
            Long incidentId,
            String reason) {}

    protected record EnrollmentFixture(
            Long courseId,
            Long waitlistId,
            Long finalLearnerId,
            int classCountBefore,
            int finalLearnerMembershipCountBefore) {}
}
