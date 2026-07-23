package org.eduspace.backend.system;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Shared test-data helpers for system tests.
 *
 * System tests exercise the real application through Selenium/API calls. Some
 * scenarios need a very specific starting state, for example a waitlist with 9
 * learners or an arbitration incident already waiting for mentor review. Those
 * states are faster and more deterministic to prepare directly in the test
 * database than by clicking through many screens before every test.
 */
abstract class SystemTestFixtures {

    private final String dbUrl = setting("system.test.db-url", "SYSTEM_TEST_DB_URL",
            "jdbc:mysql://localhost:3306/swp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private final String dbUsername = setting("system.test.db-username", "SYSTEM_TEST_DB_USERNAME", "root");
    private final String dbPassword = setting("system.test.db-password", "SYSTEM_TEST_DB_PASSWORD", "123456");

    // ---------------------------------------------------------------------
    // AUTH / USER HELPERS
    // ---------------------------------------------------------------------

    protected void setRole(String username, String role) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET role = ? WHERE username = ?")) {
            statement.setString(1, role);
            statement.setString(2, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be promoted");
        }
    }

    private Long findUserId(String username) throws Exception {
        String sql = "SELECT user_id FROM users WHERE username = ?";
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected seeded user to exist: " + username);
                return resultSet.getLong("user_id");
            }
        }
    }

    // ---------------------------------------------------------------------
    // ADMIN / CREATOR COURSE REVIEW FIXTURES
    // Used by AdminCreatorSystemTest.
    // ---------------------------------------------------------------------

    protected CourseReviewFixture createPendingCourseFixture(String titlePrefix) throws Exception {
        String suffix = shortId();
        Long creatorId = findUserId("creator1");

        try (Connection connection = connection()) {
            Long courseId = insertCourse(connection, titlePrefix + " " + suffix, creatorId, "PENDING");
            return new CourseReviewFixture(
                    courseId,
                    queryString("SELECT title FROM courses WHERE course_id = ?", courseId));
        }
    }

    protected String courseStatus(Long courseId) throws Exception {
        return queryString("SELECT status FROM courses WHERE course_id = ?", courseId);
    }

    protected String courseTitle(Long courseId) throws Exception {
        return queryString("SELECT title FROM courses WHERE course_id = ?", courseId);
    }

    protected boolean courseIsDeleted(Long courseId) throws Exception {
        return queryBoolean("SELECT is_deleted FROM courses WHERE course_id = ?", courseId);
    }

    protected int countCourseRequests(Long courseId, String status) throws Exception {
        String sql = "SELECT COUNT(*) FROM course_requests WHERE course_id = ? AND status = ?";
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, courseId);
            statement.setString(2, status);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected course request count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected int countNotificationsForCourse(Long courseId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM notifications WHERE reference_id = ?", courseId);
    }

    private Long insertCourse(Connection connection, String title, Long creatorId, String status) throws Exception {
        String sql = """
                INSERT INTO courses (title, description, status, created_at, is_deleted, creator_id)
                VALUES (?, ?, ?, NOW(), false, ?)
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, title);
            statement.setString(2, "Course generated for system workflow testing");
            statement.setString(3, status);
            statement.setLong(4, creatorId);
            statement.executeUpdate();
            return generatedId(statement);
        }
    }

    // ---------------------------------------------------------------------
    // ENROLLMENT / WAITLIST FIXTURES
    // Used by EnrollmentSystemTest.
    // ---------------------------------------------------------------------

    protected EnrollmentFixture createNearlyFullWaitlistFixture(String finalLearnerUsername) throws Exception {
        String suffix = shortId();
        Long finalLearnerId = findUserId(finalLearnerUsername);

        try (Connection connection = connection()) {
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

    protected WaitlistMembershipFixture createOpenWaitlistWithLearnerFixture(String learnerUsername)
            throws Exception {
        String suffix = shortId();
        Long learnerId = findUserId(learnerUsername);

        try (Connection connection = connection()) {
            Long creatorId = findUserId("creator1");
            Long courseId = insertCourse(connection, "System Waitlist Negative Course " + suffix, creatorId, "PUBLISHED");
            Long waitlistId = insertSystemEnrollmentWaitlist(connection, courseId);
            insertSystemEnrollmentWaitlistEntry(connection, waitlistId, learnerId, 1);

            return new WaitlistMembershipFixture(
                    courseId,
                    waitlistId,
                    learnerId,
                    countOpenWaitlistEntries(waitlistId));
        }
    }

    protected String waitlistStatus(Long waitlistId) throws Exception {
        return queryString("SELECT status FROM waitlists WHERE wait_list_id = ?", waitlistId);
    }

    protected OpenWaitlistFixture createOpenWaitlistFixture(String titlePrefix, int learnerCount)
            throws Exception {
        String suffix = shortId();

        try (Connection connection = connection()) {
            Long creatorId = findUserId("creator1");
            Long courseId = insertCourse(connection, titlePrefix + " " + suffix, creatorId, "PUBLISHED");
            insertSystemEnrollmentModule(connection, courseId);
            Long waitlistId = insertSystemEnrollmentWaitlist(connection, courseId);

            for (int i = 0; i < learnerCount; i++) {
                Long userId = insertSystemEnrollmentUser(connection, suffix, i);
                insertSystemEnrollmentWaitlistEntry(connection, waitlistId, userId, i);
            }

            return new OpenWaitlistFixture(
                    courseId,
                    waitlistId,
                    countClassesForCourse(courseId),
                    countOpenWaitlistEntries(waitlistId),
                    queryString("SELECT title FROM courses WHERE course_id = ?", courseId));
        }
    }

    protected int countClassesForCourse(Long courseId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM classes WHERE course_id = ?", courseId);
    }

    protected int countOpenWaitlistEntries(Long waitlistId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM waitlist_entries WHERE waitlist_id = ?", waitlistId);
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
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, courseId);
            statement.setLong(2, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected class membership count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected int countLearnerClassMembers(Long classId) throws Exception {
        String sql = """
                SELECT COUNT(*)
                FROM class_members
                WHERE class_id = ?
                  AND context_role = 'LEARNER'
                """;
        return queryInt(sql, classId);
    }

    protected int countStudyGroupsForClass(Long classId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM study_groups WHERE class_id = ?", classId);
    }

    protected int countTimelineRowsForClass(Long classId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM class_timeline WHERE class_id = ?", classId);
    }

    protected int countModulesForCourse(Long courseId) throws Exception {
        return queryInt("SELECT COUNT(*) FROM modules WHERE course_id = ?", courseId);
    }

    private Long insertSystemEnrollmentCourse(Connection connection, String suffix) throws Exception {
        Long creatorId = findUserId("creator1");
        return insertCourse(connection, "System Enrollment Course " + suffix, creatorId, "PUBLISHED");
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
            return generatedId(statement);
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
            return generatedId(statement);
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

    // ---------------------------------------------------------------------
    // LEARNER LEARNING / ASSIGNMENT FIXTURES
    // Used by LearnerLearningSystemTest.
    // ---------------------------------------------------------------------

    protected LearningFixture loadLearningFixture(String username) throws Exception {
        String sql = """
                SELECT
                    u.user_id,
                    cm.id AS member_id,
                    cls.class_id,
                    c.course_id,
                    c.title AS course_title,
                    m.module_id,
                    l.lesson_id,
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

        try (Connection connection = connection();
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
                        resultSet.getLong("module_id"),
                        resultSet.getLong("lesson_id"),
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

    protected void resetSingleAssignmentSubmission(Long assignmentId, Long memberId) throws Exception {
        resetAssignmentSubmissions(assignmentId, memberId, memberId);
    }

    protected int countSubmissions(Long assignmentId, Long memberId) throws Exception {
        String sql = """
                SELECT COUNT(*)
                FROM submissions
                WHERE assignment_id = ?
                  AND learner_id = ?
                """;
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, assignmentId);
            statement.setLong(2, memberId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected submission count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected int countLessonProgress(Long memberId, Long lessonId) throws Exception {
        String sql = """
                SELECT COUNT(*)
                FROM lesson_progresses
                WHERE class_member_id = ?
                  AND lesson_id = ?
                  AND is_completed = true
                """;
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, memberId);
            statement.setLong(2, lessonId);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected lesson progress count result");
                return resultSet.getInt(1);
            }
        }
    }

    protected Long findClassIdNotBelongingToLearner(String username) throws Exception {
        String sql = """
                SELECT cls.class_id
                FROM classes cls
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM class_members cm
                    JOIN users u ON u.user_id = cm.user_id
                    WHERE cm.class_id = cls.class_id
                      AND cm.context_role = 'LEARNER'
                      AND u.username = ?
                )
                LIMIT 1
                """;
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected a class fixture that learner does not belong to");
                return resultSet.getLong("class_id");
            }
        }
    }

    private void resetAssignmentSubmissions(Long assignmentId, Long firstMemberId, Long secondMemberId)
            throws Exception {
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

        try (Connection connection = connection()) {
            executeDelete(connection, deletePeerReviewsSql, assignmentId, firstMemberId, secondMemberId);
            executeDelete(connection, deleteSubmissionsSql, assignmentId, firstMemberId, secondMemberId);
        }
    }

    // ---------------------------------------------------------------------
    // MENTOR / INCIDENT / ARBITRATION FIXTURES
    // Used by MentorSystemTest.
    // ---------------------------------------------------------------------

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

        try (Connection connection = connection();
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
        String sql = """
                SELECT
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
                  AND NOT EXISTS (
                      SELECT 1
                      FROM submissions s
                      WHERE s.learner_id = reporter.id
                        AND s.assignment_id = a.assignment_id
                  )
                ORDER BY reporter.id, reported.id, a.assignment_id
                LIMIT 1
                """;

        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
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
                        submissionId,
                        resultSet.getString("class_name"),
                        resultSet.getString("course_title"),
                        resultSet.getString("assignment_title"),
                        resultSet.getString("reporter_name"));
            }
        }
    }

    protected MentorIncidentFixture createPendingMentorIncidentFixture(
            String mentorUsername,
            String incidentType,
            String reason) throws Exception {
        String learnerPairSql = """
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

        try (Connection connection = connection();
             PreparedStatement pairStatement = connection.prepareStatement(learnerPairSql)) {
            pairStatement.setString(1, mentorUsername);
            try (ResultSet resultSet = pairStatement.executeQuery()) {
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

    protected void activateUser(String username) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(
                     "UPDATE users SET status = 'ACTIVE' WHERE username = ?")) {
            statement.setString(1, username);
            assertEquals(1, statement.executeUpdate(), "Expected exactly one test user to be activated");
        }
    }

    protected boolean userExists(String username) throws Exception {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected user count result");
                return resultSet.getInt(1) > 0;
            }
        }
    }

    protected WithdrawFixture createSoftWithdrawFixture(String mentorUsername) throws Exception {
        String suffix = shortId();
        Long creatorId = findUserId("creator1");
        Long mentorId = findUserId(mentorUsername);
        Long supportMentorId = findUserId("learner3");

        try (Connection connection = connection()) {
            Long courseId = insertCourse(connection, "System Withdraw Course " + suffix, creatorId, "PUBLISHED");
            Long classId = insertSystemWithdrawClass(connection, courseId, suffix);
            Long mentorMemberId = insertSystemWithdrawClassMember(connection, classId, mentorId, "MENTOR");
            insertSystemWithdrawClassMember(connection, classId, supportMentorId, "MENTOR");

            return new WithdrawFixture(
                    courseId,
                    classId,
                    mentorMemberId,
                    "System Withdraw Class " + suffix);
        }
    }

    protected String withdrawRequestStatus(Long requestId) throws Exception {
        return queryString("SELECT status FROM withdraw_requests WHERE id = ?", requestId);
    }

    protected String withdrawRequestScenario(Long requestId) throws Exception {
        return queryString("SELECT scenario FROM withdraw_requests WHERE id = ?", requestId);
    }

    protected String classMemberStatus(Long classMemberId) throws Exception {
        return queryString("SELECT learner_status FROM class_members WHERE id = ?", classMemberId);
    }

    protected int countOpenWithdrawRequests(Long classMemberId) throws Exception {
        String sql = """
                SELECT COUNT(*)
                FROM withdraw_requests
                WHERE class_member_id = ?
                  AND status IN ('PENDING', 'HANDOVER_PENDING')
                """;
        return queryInt(sql, classMemberId);
    }

    protected Integer peerReviewFinalScore(Long submissionId) throws Exception {
        return queryNullableInt("SELECT final_score FROM peer_reviews WHERE submission_id = ?", submissionId);
    }

    protected String peerReviewComments(Long submissionId) throws Exception {
        return queryString("SELECT comments FROM peer_reviews WHERE submission_id = ?", submissionId);
    }

    protected String submissionStatus(Long submissionId) throws Exception {
        return queryString("SELECT status FROM submissions WHERE submission_id = ?", submissionId);
    }

    private Long insertSystemWithdrawClass(Connection connection, Long courseId, String suffix) throws Exception {
        String sql = """
                INSERT INTO classes (name, activated_at, status, course_id)
                VALUES (?, NOW(), 'RUNNING', ?)
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, "System Withdraw Class " + suffix);
            statement.setLong(2, courseId);
            statement.executeUpdate();
            return generatedId(statement);
        }
    }

    private Long insertSystemWithdrawClassMember(
            Connection connection,
            Long classId,
            Long userId,
            String contextRole) throws Exception {
        String sql = """
                INSERT INTO class_members (class_id, user_id, context_role, learner_status, joined_at)
                VALUES (?, ?, ?, 'ACTIVE', NOW())
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, classId);
            statement.setLong(2, userId);
            statement.setString(3, contextRole);
            statement.executeUpdate();
            return generatedId(statement);
        }
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
            return generatedId(statement);
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
                    ('ASSIGNMENT_DISPUTE', ?, ?, ?, ?, NULL, 'PENDING', NOW())
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, submissionId);
            statement.setLong(2, reporterMemberId);
            statement.setLong(3, reportedMemberId);
            statement.setString(4, "System test arbitration needs mentor grading " + shortId());
            statement.executeUpdate();
            return generatedId(statement);
        }
    }

    // ---------------------------------------------------------------------
    // LOW-LEVEL DATABASE HELPERS
    // Kept at the bottom so business workflow sections above stay readable.
    // ---------------------------------------------------------------------

    private int queryInt(String sql, Long parameter) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected query result");
                return resultSet.getInt(1);
            }
        }
    }

    private String queryString(String sql, Long parameter) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected query result");
                return resultSet.getString(1);
            }
        }
    }

    private boolean queryBoolean(String sql, Long parameter) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected query result");
                return resultSet.getBoolean(1);
            }
        }
    }

    private Integer queryNullableInt(String sql, Long parameter) throws Exception {
        try (Connection connection = connection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                assertTrue(resultSet.next(), "Expected query result");
                int value = resultSet.getInt(1);
                return resultSet.wasNull() ? null : value;
            }
        }
    }

    private void executeDelete(Connection connection, String sql, Long first, Long second, Long third)
            throws Exception {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, first);
            statement.setLong(2, second);
            statement.setLong(3, third);
            statement.executeUpdate();
        }
    }

    private Long generatedId(PreparedStatement statement) throws Exception {
        try (ResultSet keys = statement.getGeneratedKeys()) {
            assertTrue(keys.next(), "Expected generated id");
            return keys.getLong(1);
        }
    }

    private Connection connection() throws Exception {
        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    protected static String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    protected static String setting(String property, String environment, String defaultValue) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) {
            value = System.getenv(environment);
        }
        return value == null || value.isBlank() ? defaultValue : value.replaceAll("/+$", "");
    }

    // ---------------------------------------------------------------------
    // FIXTURE RESULT TYPES
    // These records make test methods readable without passing raw Object maps.
    // ---------------------------------------------------------------------

    protected record TestUser(String username, String email) {}

    protected record CourseReviewFixture(
            Long courseId,
            String title) {}

    protected record EnrollmentFixture(
            Long courseId,
            Long waitlistId,
            Long finalLearnerId,
            int classCountBefore,
            int finalLearnerMembershipCountBefore) {}

    protected record WaitlistMembershipFixture(
            Long courseId,
            Long waitlistId,
            Long learnerId,
            int entriesBefore) {}

    protected record OpenWaitlistFixture(
            Long courseId,
            Long waitlistId,
            int classCountBefore,
            int entriesBefore,
            String courseTitle) {}

    protected record LearningFixture(
            Long userId,
            Long memberId,
            Long classId,
            Long courseId,
            String courseTitle,
            Long moduleId,
            Long lessonId,
            String lessonTitle,
            Long assignmentId,
            String assignmentTitle) {}

    protected record LearningWorkflowFixture(
            LearningFixture learner,
            LearningFixture reviewer) {}

    protected record MentorFixture(
            Long classId,
            String className,
            String courseTitle,
            Long studyGroupId,
            Long incidentId) {}

    protected record ArbitrationFixture(
            Long incidentId,
            Long submissionId,
            String className,
            String courseTitle,
            String assignmentTitle,
            String reporterName) {}

    protected record MentorIncidentFixture(
            Long incidentId,
            String reason) {}

    protected record WithdrawFixture(
            Long courseId,
            Long classId,
            Long mentorMemberId,
            String className) {}
}
