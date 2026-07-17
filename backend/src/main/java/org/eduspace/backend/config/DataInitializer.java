package org.eduspace.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.*;
import org.eduspace.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassRepository classRepository;
    private final ClassMemberRepository classMemberRepository;
    private final WaitlistRepository waitlistRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final SubmissionRepository submissionRepository;
    private final ClassTimelineRepository classTimelineRepository;
    private final PasswordEncoder passwordEncoder;
    private final PeerReviewRepository peerReviewRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final IncidentRepository incidentRepository;
    private final RescueRequestRepository rescueRequestRepository;
    private final CertificateRepository certificateRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedWaitlist();
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seeding.");
            return;
        }

        log.info("=== Initializing EduSpace demo database ===");

        // ── 1. USERS ─────────────────────────────────────────────────────────────
        log.info("Seeding users...");

        User admin = userRepository.save(User.builder()
                .fullName("EduSpace Admin")
                .username("admin")
                .password(passwordEncoder.encode("password123"))
                .email("admin@eduspace.vn")
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(0)
                .build());

        User creator1 = userRepository.save(User.builder()
                .fullName("Dr. Nguyễn Văn Creator")
                .username("creator1")
                .password(passwordEncoder.encode("password123"))
                .email("creator1@eduspace.vn")
                .role(Role.CREATOR)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .bio("Giảng viên Công nghệ thông tin, 10 năm kinh nghiệm giảng dạy Java.")
                .totalExp(500)
                .build());

        User mentor1 = userRepository.save(User.builder()
                .fullName("Mentor Trần Văn Mentor")
                .username("mentor1")
                .password(passwordEncoder.encode("password123"))
                .email("mentor1@eduspace.vn")
                .role(Role.MENTOR)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(300)
                .build());

        User learner1 = userRepository.save(User.builder()
                .fullName("Học viên Nguyễn Learner One")
                .username("learner1")
                .password(passwordEncoder.encode("password123"))
                .email("learner1@eduspace.vn")
                .role(Role.LEARNER)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(100)
                .build());

        User learner2 = userRepository.save(User.builder()
                .fullName("Học viên Lê Learner Two")
                .username("learner2")
                .password(passwordEncoder.encode("password123"))
                .email("learner2@eduspace.vn")
                .role(Role.LEARNER)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(80)
                .build());

        // Extra learners for misc data
        List<User> extraLearners = new ArrayList<>();
        for (int i = 3; i <= 6; i++) {
            extraLearners.add(userRepository.save(User.builder()
                    .fullName("Học viên EduSpace " + i)
                    .username("learner" + i)
                    .password(passwordEncoder.encode("password123"))
                    .email("learner" + i + "@eduspace.vn")
                    .role(Role.LEARNER)
                    .status(UserStatus.ACTIVE)
                    .authProvider(AuthProvider.LOCAL)
                    .createdAt(LocalDateTime.now())
                    .totalExp(i * 20)
                    .build()));
        }

        // ── 2. COURSE ─────────────────────────────────────────────────────────────
        log.info("Seeding course...");

        Course courseJava = courseRepository.save(Course.builder()
                .title("Lập trình Java hướng đối tượng (OOP)")
                .description("Khóa học cung cấp kiến thức nền tảng về Java và 4 tính chất cốt lõi của OOP.")
                .status(CourseStatus.PUBLISHED)
                .createdAt(LocalDateTime.now())
                .creator(creator1)
                .isDeleted(false)
                .build());

        Course courseReact = courseRepository.save(Course.builder()
                .title("Xây dựng ứng dụng Web với React & Node.js")
                .description("Học cách xây dựng giao diện người dùng hiện đại với React.")
                .status(CourseStatus.PUBLISHED)
                .createdAt(LocalDateTime.now())
                .creator(creator1)
                .isDeleted(false)
                .build());

        // ── 3. MODULES ────────────────────────────────────────────────────────────
        log.info("Seeding modules...");

        // Java course: 3 modules
        CourseModule mod1 = moduleRepository.save(CourseModule.builder()
                .title("Module 1: Cú pháp Java & Biến")
                .priority(ModulePriority.HIGH)
                .days(7).baseExp(100).speedBonusExp(50).sortOrder(1)
                .course(courseJava).build());

        CourseModule mod2 = moduleRepository.save(CourseModule.builder()
                .title("Module 2: Lập trình hướng đối tượng (OOP)")
                .priority(ModulePriority.HIGH)
                .days(10).baseExp(150).speedBonusExp(75).sortOrder(2)
                .course(courseJava).build());

        CourseModule mod3 = moduleRepository.save(CourseModule.builder()
                .title("Module 3: Collections Framework (Pair Learning)")
                .priority(ModulePriority.MEDIUM)
                .days(5).baseExp(100).speedBonusExp(40).sortOrder(3)
                .course(courseJava).build());

        // React course: 1 module (for other learners)
        CourseModule reactMod1 = moduleRepository.save(CourseModule.builder()
                .title("Module 1: React Cơ Bản")
                .priority(ModulePriority.HIGH)
                .days(7).baseExp(100).speedBonusExp(50).sortOrder(1)
                .course(courseReact).build());

        // ── 4. LESSONS ────────────────────────────────────────────────────────────
        log.info("Seeding lessons...");

        // Module 1 lessons (2 lessons)
        Lesson lesson1_1 = lessonRepository.save(Lesson.builder()
                .module(mod1).title("Bài 1: Giới thiệu Java & JDK")
                .contentType(LessonContentType.VIDEO)
                .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                .sortOrder(1).build());

        Lesson lesson1_2 = lessonRepository.save(Lesson.builder()
                .module(mod1).title("Bài 2: Kiểu dữ liệu và Biến")
                .contentType(LessonContentType.TEXT)
                .contentUrl(
                        "Java có 8 kiểu dữ liệu nguyên thủy: byte, short, int, long, float, double, char, boolean...")
                .sortOrder(2).build());

        // Module 2 lessons (2 lessons)
        Lesson lesson2_1 = lessonRepository.save(Lesson.builder()
                .module(mod2).title("Bài 1: Class và Object")
                .contentType(LessonContentType.VIDEO)
                .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                .sortOrder(1).build());

        Lesson lesson2_2 = lessonRepository.save(Lesson.builder()
                .module(mod2).title("Bài 2: Tính Đóng gói (Encapsulation)")
                .contentType(LessonContentType.DOCUMENT)
                .contentUrl("https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html")
                .sortOrder(2).build());

        // Module 3 lessons (2 lessons — learner1 & learner2 chỉ hoàn thành bài 1, chưa
        // hoàn thành bài 2)
        Lesson lesson3_1 = lessonRepository.save(Lesson.builder()
                .module(mod3).title("Bài 1: ArrayList và LinkedList")
                .contentType(LessonContentType.VIDEO)
                .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                .sortOrder(1).build());

        Lesson lesson3_2 = lessonRepository.save(Lesson.builder()
                .module(mod3).title("Bài 2: HashMap và HashSet")
                .contentType(LessonContentType.DOCUMENT)
                .contentUrl("https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html")
                .sortOrder(2).build());

        // React lesson
        lessonRepository.save(Lesson.builder()
                .module(reactMod1).title("Bài 1: Virtual DOM là gì?")
                .contentType(LessonContentType.TEXT)
                .contentUrl("React sử dụng Virtual DOM để tối ưu hiệu năng render...")
                .sortOrder(1).build());

        // ── 5. ASSIGNMENTS ────────────────────────────────────────────────────────
        log.info("Seeding assignments...");

        List<RubricCriteriaDto> rubric1 = List.of(
                new RubricCriteriaDto("Chạy đúng", "Chương trình biên dịch và chạy không lỗi", 5),
                new RubricCriteriaDto("Cú pháp chuẩn", "Đặt tên biến và cấu trúc code đúng quy chuẩn", 3),
                new RubricCriteriaDto("Hiệu năng", "Sử dụng bộ nhớ tối ưu", 2));

        Assignment assign1 = assignmentRepository.save(Assignment.builder()
                .title("Bài tập Module 1: Cú pháp Java cơ bản")
                .description("Viết chương trình tính giai thừa và kiểm tra số nguyên tố.")
                .rubricCriteria(rubric1)
                .module(mod1).build());

        List<RubricCriteriaDto> rubric2 = List.of(
                new RubricCriteriaDto("Tính kế thừa", "Sử dụng extends và override đúng cách", 5),
                new RubricCriteriaDto("Tính đóng gói", "Dùng private fields + getters/setters", 5));

        Assignment assign2 = assignmentRepository.save(Assignment.builder()
                .title("Bài tập Module 2: Thiết kế lớp OOP")
                .description("Xây dựng hệ thống quản lý thư viện với Sách, Độc giả, Phiếu mượn.")
                .rubricCriteria(rubric2)
                .module(mod2).build());

        List<RubricCriteriaDto> rubric3 = List.of(
                new RubricCriteriaDto("Dùng đúng Collection", "Chọn ArrayList/HashMap/HashSet phù hợp bài toán", 5),
                new RubricCriteriaDto("Hiệu năng", "Lựa chọn phù hợp về time complexity", 5));

        Assignment assign3 = assignmentRepository.save(Assignment.builder()
                .title("Bài tập Module 3: Collections Framework")
                .description("Viết chương trình quản lý sinh viên dùng ArrayList và HashMap.")
                .rubricCriteria(rubric3)
                .module(mod3).build());

        // ── 6. CLASS ──────────────────────────────────────────────────────────────
        log.info("Seeding class...");

        CourseClass javaClass = classRepository.save(CourseClass.builder()
                .name("Lớp Java OOP - K20 (Demo)")
                .activatedAt(LocalDateTime.now().minusDays(30))
                .status(ClassStatus.RUNNING)
                .course(courseJava)
                .build());

        CourseClass reactClass = classRepository.save(CourseClass.builder()
                .name("Lớp React Web - K05")
                .activatedAt(LocalDateTime.now().minusDays(5))
                .status(ClassStatus.UPCOMING)
                .course(courseReact)
                .build());

        // ── 7. CLASS MEMBERS ──────────────────────────────────────────────────────
        log.info("Seeding class members...");

        // learner1 & learner2 in java class (demo pair)
        ClassMember member1 = classMemberRepository.save(ClassMember.builder()
                .courseClass(javaClass).user(learner1)
                .contextRole("LEARNER").learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now().minusDays(30)).build());

        ClassMember member2 = classMemberRepository.save(ClassMember.builder()
                .courseClass(javaClass).user(learner2)
                .contextRole("LEARNER").learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now().minusDays(30)).build());

        // Mentor in java class
        classMemberRepository.save(ClassMember.builder()
                .courseClass(javaClass).user(mentor1)
                .contextRole("MENTOR").learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now().minusDays(30)).build());

        // Extra learners in java class
        List<ClassMember> extraMembers = new ArrayList<>();
        for (User u : extraLearners) {
            extraMembers.add(classMemberRepository.save(ClassMember.builder()
                    .courseClass(javaClass).user(u)
                    .contextRole("LEARNER").learnerStatus(LearnerStatus.ACTIVE)
                    .joinedAt(LocalDateTime.now().minusDays(20)).build()));
        }

        // Extra learners waitlist for react
        Waitlist waitlistReact = waitlistRepository.save(Waitlist.builder()
                .course(courseReact).createdAt(LocalDateTime.now())
                .status(WaitlistStatus.OPENING).build());
        for (int i = 0; i < 3; i++) {
            waitlistEntryRepository.save(WaitlistEntry.builder()
                    .waitlist(waitlistReact).user(extraLearners.get(i))
                    .enrolledAt(LocalDateTime.now().minusDays(i)).build());
        }

        // ── 8. STUDY GROUP (Pair Learning — Module 3) ─────────────────────────────
        log.info("Seeding study group for pair learning...");

        StudyGroup pairGroup = studyGroupRepository.save(StudyGroup.builder()
                .courseClass(javaClass)
                .module(mod3)
                .chatChannelId("channel_java_pair_learner1_learner2")
                .chatStatus("ACTIVE")
                .build());

        GroupMember gm1 = groupMemberRepository.save(GroupMember.builder()
                .studyGroup(pairGroup).classMember(member1).build());

        GroupMember gm2 = groupMemberRepository.save(GroupMember.builder()
                .studyGroup(pairGroup).classMember(member2).build());

        // ── 9. CLASS TIMELINE (Module unlock — all past so all unlocked) ──────────
        log.info("Seeding class timelines...");

        classTimelineRepository.save(ClassTimeline.builder()
                .courseClass(javaClass).module(mod1)
                .dueDate(LocalDateTime.now().minusDays(25)).build());

        classTimelineRepository.save(ClassTimeline.builder()
                .courseClass(javaClass).module(mod2)
                .dueDate(LocalDateTime.now().minusDays(15)).build());

        classTimelineRepository.save(ClassTimeline.builder()
                .courseClass(javaClass).module(mod3)
                .dueDate(LocalDateTime.now().minusDays(5)).build());

        // ── 10. PROGRESS ──────────────────────────────────────────────────────────
        // learner1 & learner2 trạng thái:
        // Module 1: hoàn thành toàn bộ 2 lessons + assignment (GRADED)
        // Module 2: hoàn thành toàn bộ 2 lessons + assignment (GRADED)
        // Module 3: hoàn thành lesson3_1, CHƯA hoàn thành lesson3_2, CHƯA nộp assign3
        // => Tiến độ ≈ 71% (5/7 units: 4 lessons + 1 assign hoàn thành trên tổng 6
        // lessons + 3 assigns)
        log.info("Seeding progress for learner1 & learner2 (demo state)...");

        for (ClassMember member : List.of(member1, member2)) {
            // Module 1 lessons — completed
            lessonProgressRepository.save(LessonProgress.builder()
                    .classMember(member).lesson(lesson1_1)
                    .isCompleted(true).completedAt(LocalDateTime.now().minusDays(20)).build());
            lessonProgressRepository.save(LessonProgress.builder()
                    .classMember(member).lesson(lesson1_2)
                    .isCompleted(true).completedAt(LocalDateTime.now().minusDays(19)).build());

            // Module 2 lessons — completed
            lessonProgressRepository.save(LessonProgress.builder()
                    .classMember(member).lesson(lesson2_1)
                    .isCompleted(true).completedAt(LocalDateTime.now().minusDays(12)).build());
            lessonProgressRepository.save(LessonProgress.builder()
                    .classMember(member).lesson(lesson2_2)
                    .isCompleted(true).completedAt(LocalDateTime.now().minusDays(11)).build());

            // Module 3 — lesson3_1 completed, lesson3_2 NOT yet
            lessonProgressRepository.save(LessonProgress.builder()
                    .classMember(member).lesson(lesson3_1)
                    .isCompleted(true).completedAt(LocalDateTime.now().minusDays(3)).build());

            // Module 1 assignment — GRADED (submitted + reviewed)
            Submission sub1 = submissionRepository.save(Submission.builder()
                    .assignment(assign1).member(member)
                    .submissionContent("Bài làm Module 1 của " + member.getUser().getFullName())
                    .status(SubmissionStatus.GRADED)
                    .submittedAt(LocalDateTime.now().minusDays(18)).build());

            // Module 2 assignment — GRADED
            Submission sub2 = submissionRepository.save(Submission.builder()
                    .assignment(assign2).member(member)
                    .submissionContent("Bài làm Module 2 của " + member.getUser().getFullName())
                    .status(SubmissionStatus.GRADED)
                    .submittedAt(LocalDateTime.now().minusDays(10)).build());
        }

        // ── 11. MENTOR DATA ───────────────────────────────────────────────────────
        log.info("Seeding mentor certificate & active mentor...");

        Certificate mentorCert = certificateRepository.save(Certificate.builder()
                .user(mentor1).course(courseJava)
                .issuedAt(LocalDateTime.now().minusDays(60)).build());

        activeMentorRepository.save(ActiveMentor.builder()
                .user(mentor1).course(courseJava)
                .mentorStatus(MentorStatus.AVAILABLE).build());

        // ── 12. INCIDENTS (sample data) ───────────────────────────────────────────
        log.info("Seeding incident data...");

        // Create a submission for extraMembers.get(0)
        Submission subDispute = submissionRepository.save(Submission.builder()
                .assignment(assign1)
                .member(extraMembers.get(0))
                .submissionContent("Bài nộp cần chấm lại: public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello World\"); } }")
                .status(SubmissionStatus.GRADED)
                .submittedAt(LocalDateTime.now().minusDays(3))
                .build());

        // Create a PeerReview for the submission, reviewed by extraMembers.get(1)
        List<RubricCriteriaDto> rubricScores = List.of(
                new RubricCriteriaDto("Chạy đúng", "Chương trình biên dịch và chạy không lỗi", 5, 2),
                new RubricCriteriaDto("Cú pháp chuẩn", "Đặt tên biến và cấu trúc code đúng quy chuẩn", 3, 1),
                new RubricCriteriaDto("Hiệu năng", "Sử dụng bộ nhớ tối ưu", 2, 0)
        );
        peerReviewRepository.save(PeerReview.builder()
                .submission(subDispute)
                .criteriaScores(rubricScores)
                .finalScore(3)
                .comments("Bài làm quá sơ sài, copy từ mạng.")
                .reviewAt(LocalDateTime.now().minusDays(2))
                .isOverridden(false)
                .build());

        Incident inc1 = incidentRepository.save(Incident.builder()
                .incidentType(IncidentType.ASSIGNMENT_DISPUTE)
                .submission(subDispute)
                .reporter(extraMembers.get(0))
                .reported(extraMembers.get(1))
                .reason("Học viên chấm điểm chéo không khách quan, đánh giá sai lệch bài tập Java.")
                .status(IncidentStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(2)).build());

        rescueRequestRepository.save(RescueRequest.builder()
                .incident(inc1)
                .learner(extraMembers.get(0))
                .rescueStartedAt(LocalDateTime.now().minusDays(2))
                .rescueDeadline(LocalDateTime.now().plusHours(24))
                .status(RescueStatus.ON_GOING).build());

        log.info("=== Demo database initialized successfully ===");
        log.info("Accounts: learner1/123456, learner2/123456, mentor1/123456, creator1/123456, admin/123456");
        log.info(
                "Trạng thái learner1 & learner2: Module 1 & 2 hoàn thành, Module 3 đang học (lesson3_1 done, lesson3_2 + assign3 còn lại)");
        seedWaitlist();
    }

    private void seedWaitlist() {
        courseRepository.findByIsDeletedFalse().stream()
                .filter(c -> "Xây dựng ứng dụng Web với React & Node.js".equals(c.getTitle()))
                .findFirst()
                .ifPresent(reactCourse -> {
                    Waitlist activeWaitlist = waitlistRepository
                            .findByCourseIdAndStatus(reactCourse.getId(), WaitlistStatus.OPENING)
                            .orElseGet(() -> waitlistRepository.save(Waitlist.builder()
                                    .course(reactCourse)
                                    .status(WaitlistStatus.OPENING)
                                    .createdAt(LocalDateTime.now())
                                    .build()));

                    int currentCount = waitlistEntryRepository.countByWaitlistId(activeWaitlist.getId());
                    if (currentCount < 9) {
                        log.info("React course waitlist has {} members. Seeding up to 9...", currentCount);
                        for (int i = currentCount + 1; i <= 9; i++) {
                            final int index = i;
                            String username = "waitlist_user" + index;
                            User waitlistUser = userRepository.findByUsername(username)
                                    .orElseGet(() -> userRepository.save(User.builder()
                                            .fullName("Học viên Chờ " + index)
                                            .username(username)
                                            .password(passwordEncoder.encode("password123"))
                                            .email(username + "@eduspace.vn")
                                            .role(Role.LEARNER)
                                            .status(UserStatus.ACTIVE)
                                            .authProvider(AuthProvider.LOCAL)
                                            .createdAt(LocalDateTime.now())
                                            .totalExp(0)
                                            .build()));

                            boolean isAlreadyWaiting = waitlistEntryRepository.isUserAlreadyWaiting(reactCourse.getId(), waitlistUser.getId());
                            if (!isAlreadyWaiting) {
                                waitlistEntryRepository.save(WaitlistEntry.builder()
                                        .waitlist(activeWaitlist)
                                        .user(waitlistUser)
                                        .enrolledAt(LocalDateTime.now())
                                        .build());
                            }
                        }
                        log.info("Waitlist seeding complete for React course.");
                    }
                });
    }
}
