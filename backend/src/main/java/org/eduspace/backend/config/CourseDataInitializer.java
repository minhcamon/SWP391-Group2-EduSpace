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
public class CourseDataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final CourseRepository courseRepository;
        private final ModuleRepository moduleRepository;
        private final LessonRepository lessonRepository;
        private final AssignmentRepository assignmentRepository;
        private final WaitlistRepository waitlistRepository;
        private final WaitlistEntryRepository waitlistEntryRepository;
        private final CertificateRepository certificateRepository;
        private final ActiveMentorRepository activeMentorRepository;
        private final ClassRepository classRepository;
        private final ClassMemberRepository classMemberRepository;
        private final StudyGroupRepository studyGroupRepository;
        private final GroupMemberRepository groupMemberRepository;
        private final ClassTimelineRepository classTimelineRepository;
        private final LessonProgressRepository lessonProgressRepository;
        private final SubmissionRepository submissionRepository;
        private final PeerReviewRepository peerReviewRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                if (courseRepository.count() > 0) {
                        log.info("Courses already initialized. Skipping CourseDataInitializer.");
                        return;
                }

                log.info("=== Initializing CourseDataInitializer (Courses, Users, Mentors, Course 1 Class & Course 2 Waitlist) ===");

                // ── 1. USERS ─────────────────────────────────────────────────────────────
                userRepository.save(User.builder()
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
                                .fullName("Dr. Nguyễn Văn Creator (Java & Backend)")
                                .username("creator1")
                                .password(passwordEncoder.encode("password123"))
                                .email("creator1@eduspace.vn")
                                .role(Role.CREATOR)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .bio("Giảng viên Công nghệ thông tin, 10 năm kinh nghiệm giảng dạy Java & Spring Boot.")
                                .totalExp(500)
                                .build());

                User creator2 = userRepository.save(User.builder()
                                .fullName("ThS. Trần Thị Creator (Frontend & Web)")
                                .username("creator2")
                                .password(passwordEncoder.encode("password123"))
                                .email("creator2@eduspace.vn")
                                .role(Role.CREATOR)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .bio("Chuyên gia Frontend UI/UX, 8 năm kinh nghiệm React, Vue và Next.js.")
                                .totalExp(450)
                                .build());

                User creator3 = userRepository.save(User.builder()
                                .fullName("KS. Lê Hoàng Creator (Data & AI)")
                                .username("creator3")
                                .password(passwordEncoder.encode("password123"))
                                .email("creator3@eduspace.vn")
                                .role(Role.CREATOR)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .bio("Kỹ sư Data Science & Machine Learning, giảng viên AI ứng dụng.")
                                .totalExp(400)
                                .build());

                User mentor1 = userRepository.save(User.builder()
                                .fullName("Mentor Trần Văn Mentor 1")
                                .username("mentor1")
                                .password(passwordEncoder.encode("password123"))
                                .email("mentor1@eduspace.vn")
                                .role(Role.MENTOR)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(300)
                                .build());

                User mentor2 = userRepository.save(User.builder()
                                .fullName("Mentor Nguyễn Thị Mentor 2")
                                .username("mentor2")
                                .password(passwordEncoder.encode("password123"))
                                .email("mentor2@eduspace.vn")
                                .role(Role.MENTOR)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(350)
                                .build());

                User learner1 = userRepository.save(User.builder()
                                .fullName("Học viên Nguyễn Learner 1")
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
                                .fullName("Học viên Lê Learner 2")
                                .username("learner2")
                                .password(passwordEncoder.encode("password123"))
                                .email("learner2@eduspace.vn")
                                .role(Role.LEARNER)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(110)
                                .build());

                User learner3 = userRepository.save(User.builder()
                                .fullName("Học viên Trần Learner 3")
                                .username("learner3")
                                .password(passwordEncoder.encode("password123"))
                                .email("learner3@eduspace.vn")
                                .role(Role.LEARNER)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(90)
                                .build());

                User learner4 = userRepository.save(User.builder()
                                .fullName("Học viên Phạm Learner 4")
                                .username("learner4")
                                .password(passwordEncoder.encode("password123"))
                                .email("learner4@eduspace.vn")
                                .role(Role.LEARNER)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(95)
                                .build());

                List<User> learnersToEnroll = new ArrayList<>();
                learnersToEnroll.add(learner2);
                learnersToEnroll.add(learner3);
                learnersToEnroll.add(learner4);

                for (int i = 5; i <= 10; i++) {
                        User learner = userRepository.save(User.builder()
                                        .fullName("Học viên EduSpace Learner " + i)
                                        .username("learner" + i)
                                        .password(passwordEncoder.encode("password123"))
                                        .email("learner" + i + "@eduspace.vn")
                                        .role(Role.LEARNER)
                                        .status(UserStatus.ACTIVE)
                                        .authProvider(AuthProvider.LOCAL)
                                        .createdAt(LocalDateTime.now())
                                        .totalExp(i * 10)
                                        .build());
                        learnersToEnroll.add(learner);
                }

                // ── 2. COURSES (10 PUBLISHED + 2 DRAFT OF CREATOR 1) ──────────────────────
                log.info("Seeding 12 courses (10 Published, 2 Draft for Creator 1)...");

                // Creator 1 Courses (4 Published + 2 Draft = 6 total)
                Course course1 = createCourseWithModules(
                                "Lập trình Java Căn Bản & Hướng Đối Tượng (Cơ bản)",
                                "Khóa học cung cấp kiến thức nền tảng về Java, cú pháp ngôn ngữ và 4 tính chất cốt lõi của OOP.",
                                CourseStatus.PUBLISHED,
                                creator1,
                                "Java OOP");

                Course course2 = createCourseWithModules(
                                "Lập trình Web với Spring Boot & Microservices (Nâng cao)",
                                "Xây dựng hệ thống Web API chuẩn RESTful, tích hợp Spring Security, JPA và kiến trúc Microservices.",
                                CourseStatus.PUBLISHED,
                                creator1,
                                "Spring Boot");

                createCourseWithModules(
                                "Cấu trúc Dữ liệu & Giải thuật Nâng Cao",
                                "Chinh phục các bài toán thuật toán nâng cao, tối ưu hóa độ phức tạp thời gian và không gian bộ nhớ.",
                                CourseStatus.PUBLISHED,
                                creator1,
                                "DSA");

                createCourseWithModules(
                                "Thiết kế Phân tán Distributed Systems",
                                "Học cách thiết kế hệ thống có khả năng mở rộng cao, xử lý hàng triệu request với Redis và Kafka.",
                                CourseStatus.PUBLISHED,
                                creator1,
                                "Distributed Systems");

                // 2 Draft Courses of Creator 1
                createCourseWithModules(
                                "Lập trình Mobile Android với Kotlin [Draft]",
                                "Khóa học đang soạn thảo: Xây dựng ứng dụng di động Android hiện đại sử dụng Kotlin và Jetpack Compose.",
                                CourseStatus.DRAFT,
                                creator1,
                                "Android Kotlin");

                createCourseWithModules(
                                "Kiến trúc Phần mềm Software Architecture [Draft]",
                                "Khóa học đang soạn thảo: Các nguyên lý Clean Architecture, DDD và Microservices Pattern.",
                                CourseStatus.DRAFT,
                                creator1,
                                "Software Architecture");

                // Creator 2 Courses (3 Published)
                createCourseWithModules(
                                "Lập trình Frontend Nâng Cao với React & Next.js",
                                "Xây dựng giao diện web hiện đại, Server-side Rendering (SSR) và tối ưu hóa hiệu năng ứng dụng React.",
                                CourseStatus.PUBLISHED,
                                creator2,
                                "React & Next.js");

                createCourseWithModules(
                                "Lập trình Backend Node.js & Express RESTful API",
                                "Học lập trình Backend bất đồng bộ với Node.js, Express framework và cơ sở dữ liệu MongoDB/PostgreSQL.",
                                CourseStatus.PUBLISHED,
                                creator2,
                                "Node.js Express");

                createCourseWithModules(
                                "Xây dựng Ứng dụng Real-time với Vue.js & WebSockets",
                                "Thiết kế giao diện Vue 3 reactive và truyền tải dữ liệu thời gian thực sử dụng Socket.io.",
                                CourseStatus.PUBLISHED,
                                creator2,
                                "Vue.js Realtime");

                // Creator 3 Courses (3 Published)
                createCourseWithModules(
                                "Nhập môn Khoa học Dữ liệu & Python cho AI",
                                "Làm quen với phân tích dữ liệu, xử lý mảng với NumPy, Pandas và trực quan hóa dữ liệu với Matplotlib.",
                                CourseStatus.PUBLISHED,
                                creator3,
                                "Python Data Science");

                createCourseWithModules(
                                "Học máy Machine Learning & Deep Learning",
                                "Xây dựng các mô hình dự đoán, mạng thần kinh nhân tạo (Neural Networks) với Scikit-Learn và PyTorch.",
                                CourseStatus.PUBLISHED,
                                creator3,
                                "Machine Learning");

                createCourseWithModules(
                                "DevOps & CI/CD Pipeline với Docker & Kubernetes",
                                "Tự động hóa quy trình đóng gói ứng dụng với Docker, quản lý container cluster với Kubernetes và GitHub Actions.",
                                CourseStatus.PUBLISHED,
                                creator3,
                                "DevOps Kubernetes");

                // ── 3. MENTOR DATA (CERTIFICATES & ACTIVE MENTOR) ────────────────────
                log.info("Seeding Mentor Certificates & Active Mentor data (Mentor 1 -> Course 1, Mentor 2 -> Course 2)...");

                // Certificate & ActiveMentor for Mentor 1 (Course 1 - Java OOP)
                certificateRepository.save(Certificate.builder()
                                .user(mentor1)
                                .course(course1)
                                .issuedAt(LocalDateTime.now().minusDays(60))
                                .build());

                activeMentorRepository.save(ActiveMentor.builder()
                                .user(mentor1)
                                .course(course1)
                                .mentorStatus(MentorStatus.AVAILABLE)
                                .build());

                // Certificate & ActiveMentor for Mentor 2 (Course 2 - Spring Boot)
                certificateRepository.save(Certificate.builder()
                                .user(mentor2)
                                .course(course2)
                                .issuedAt(LocalDateTime.now().minusDays(60))
                                .build());

                activeMentorRepository.save(ActiveMentor.builder()
                                .user(mentor2)
                                .course(course2)
                                .mentorStatus(MentorStatus.AVAILABLE)
                                .build());

                // ── 4. COURSE 1 CLASS, MODULE 1 PROGRESS, ASSIGNMENTS & STUDY GROUPS ──
                log.info("Seeding Course 1 Class data (Learners 1-4 completed Module 1, Assignments & Study Groups)...");

                CourseClass javaClass = classRepository.save(CourseClass.builder()
                                .name("Lớp Java OOP - K01")
                                .activatedAt(LocalDateTime.now().minusDays(20))
                                .status(ClassStatus.RUNNING)
                                .course(course1)
                                .build());

                ClassMember cm1 = classMemberRepository.save(ClassMember.builder()
                                .courseClass(javaClass)
                                .user(learner1)
                                .contextRole("LEARNER")
                                .learnerStatus(LearnerStatus.ACTIVE)
                                .joinedAt(LocalDateTime.now().minusDays(20))
                                .build());

                ClassMember cm2 = classMemberRepository.save(ClassMember.builder()
                                .courseClass(javaClass)
                                .user(learner2)
                                .contextRole("LEARNER")
                                .learnerStatus(LearnerStatus.ACTIVE)
                                .joinedAt(LocalDateTime.now().minusDays(20))
                                .build());

                ClassMember cm3 = classMemberRepository.save(ClassMember.builder()
                                .courseClass(javaClass)
                                .user(learner3)
                                .contextRole("LEARNER")
                                .learnerStatus(LearnerStatus.ACTIVE)
                                .joinedAt(LocalDateTime.now().minusDays(20))
                                .build());

                ClassMember cm4 = classMemberRepository.save(ClassMember.builder()
                                .courseClass(javaClass)
                                .user(learner4)
                                .contextRole("LEARNER")
                                .learnerStatus(LearnerStatus.ACTIVE)
                                .joinedAt(LocalDateTime.now().minusDays(20))
                                .build());

                classMemberRepository.save(ClassMember.builder()
                                .courseClass(javaClass)
                                .user(mentor1)
                                .contextRole("MENTOR")
                                .learnerStatus(LearnerStatus.ACTIVE)
                                .joinedAt(LocalDateTime.now().minusDays(20))
                                .build());

                // Get Module 1 of Course 1
                List<CourseModule> course1Modules = moduleRepository.findByCourseIdOrderBySortOrder(course1.getId());
                CourseModule module1 = course1Modules.get(0);

                // ClassTimeline for all modules in Course 1
                for (int idx = 0; idx < course1Modules.size(); idx++) {
                        classTimelineRepository.save(ClassTimeline.builder()
                                        .courseClass(javaClass)
                                        .module(course1Modules.get(idx))
                                        .dueDate(LocalDateTime.now().plusDays((idx + 1) * 7L))
                                        .build());
                }

                // Complete 4 Lessons of Module 1 for Learners 1-4
                List<Lesson> module1Lessons = lessonRepository.findByModuleIdOrderBySortOrder(module1.getId());
                List<ClassMember> c1LearnerMembers = List.of(cm1, cm2, cm3, cm4);

                for (ClassMember cm : c1LearnerMembers) {
                        for (Lesson lesson : module1Lessons) {
                                lessonProgressRepository.save(LessonProgress.builder()
                                                .classMember(cm)
                                                .lesson(lesson)
                                                .isCompleted(true)
                                                .completedAt(LocalDateTime.now().minusDays(10))
                                                .build());
                        }
                }

                // Study Groups: Pair 1 (Learner 1 & Learner 2), Pair 2 (Learner 3 & Learner 4)
                StudyGroup group1 = studyGroupRepository.save(StudyGroup.builder()
                                .courseClass(javaClass)
                                .module(module1)
                                .chatChannelId("channel_java_pair_learner1_learner2")
                                .chatStatus("ACTIVE")
                                .build());

                GroupMember gm1 = groupMemberRepository.save(GroupMember.builder()
                                .studyGroup(group1)
                                .classMember(cm1)
                                .build());

                GroupMember gm2 = groupMemberRepository.save(GroupMember.builder()
                                .studyGroup(group1)
                                .classMember(cm2)
                                .build());

                StudyGroup group2 = studyGroupRepository.save(StudyGroup.builder()
                                .courseClass(javaClass)
                                .module(module1)
                                .chatChannelId("channel_java_pair_learner3_learner4")
                                .chatStatus("ACTIVE")
                                .build());

                GroupMember gm3 = groupMemberRepository.save(GroupMember.builder()
                                .studyGroup(group2)
                                .classMember(cm3)
                                .build());

                GroupMember gm4 = groupMemberRepository.save(GroupMember.builder()
                                .studyGroup(group2)
                                .classMember(cm4)
                                .build());

                // Assignment Submissions & Peer Reviews for Module 1 Assignment
                Assignment assignment1 = assignmentRepository.findByModuleId(module1.getId()).orElse(null);

                if (assignment1 != null) {
                        List<RubricCriteriaDto> rubrics1 = List.of(
                                        new RubricCriteriaDto("Tính đúng đắn",
                                                        "Chương trình chạy chính xác theo yêu cầu bài toán", 5),
                                        new RubricCriteriaDto("Cấu trúc Code",
                                                        "Code sạch, tuân thủ convention và dễ bảo trì", 3),
                                        new RubricCriteriaDto("Tối ưu & Hiệu năng",
                                                        "Sử dụng thuật toán và bộ nhớ hiệu quả", 2));

                        // ── STEP 1: Create Submissions (SUBMITTED) & Assign Peer Reviews ──────
                        log.info("Step 1: Creating Submissions and assigning Peer Reviews...");

                        // Learner 1 submitted, Learner 2 assigned as reviewer
                        Submission sub1 = submissionRepository.save(Submission.builder()
                                        .assignment(assignment1)
                                        .member(cm1)
                                        .submissionContent(
                                                        "Bài làm Module 1 của Học viên Nguyễn Learner 1: Thực hành thiết kế các lớp Java OOP (SinhVien, QuanLySinhVien) và đóng gói dữ liệu.")
                                        .submittedAt(LocalDateTime.now().minusDays(7))
                                        .status(SubmissionStatus.SUBMITTED)
                                        .build());

                        PeerReview pr1 = peerReviewRepository.save(PeerReview.builder()
                                        .submission(sub1)
                                        .reviewer(gm2)
                                        .isOverridden(false)
                                        .build());

                        // Learner 2 submitted, Learner 1 assigned as reviewer
                        Submission sub2 = submissionRepository.save(Submission.builder()
                                        .assignment(assignment1)
                                        .member(cm2)
                                        .submissionContent(
                                                        "Bài làm Module 1 của Học viên Lê Learner 2: Thiết kế mô hình OOP Quản lý Thư viện sách trong Java.")
                                        .submittedAt(LocalDateTime.now().minusDays(7))
                                        .status(SubmissionStatus.SUBMITTED)
                                        .build());

                        PeerReview pr2 = peerReviewRepository.save(PeerReview.builder()
                                        .submission(sub2)
                                        .reviewer(gm1)
                                        .isOverridden(false)
                                        .build());

                        // Learner 3 submitted, Learner 4 assigned as reviewer
                        Submission sub3 = submissionRepository.save(Submission.builder()
                                        .assignment(assignment1)
                                        .member(cm3)
                                        .submissionContent(
                                                        "Bài làm Module 1 của Học viên Trần Learner 3: Xây dựng mô hình Quản lý Sản phẩm Cửa hàng sử dụng Tính Đa hình trong Java.")
                                        .submittedAt(LocalDateTime.now().minusDays(7))
                                        .status(SubmissionStatus.SUBMITTED)
                                        .build());

                        PeerReview pr3 = peerReviewRepository.save(PeerReview.builder()
                                        .submission(sub3)
                                        .reviewer(gm4)
                                        .isOverridden(false)
                                        .build());

                        // Learner 4 submitted, Learner 3 assigned as reviewer
                        Submission sub4 = submissionRepository.save(Submission.builder()
                                        .assignment(assignment1)
                                        .member(cm4)
                                        .submissionContent(
                                                        "Bài làm Module 1 của Học viên Phạm Learner 4: Quản lý Nhân sự Công ty phần mềm với Java OOP Interface và Abstract Class.")
                                        .submittedAt(LocalDateTime.now().minusDays(7))
                                        .status(SubmissionStatus.SUBMITTED)
                                        .build());

                        PeerReview pr4 = peerReviewRepository.save(PeerReview.builder()
                                        .submission(sub4)
                                        .reviewer(gm3)
                                        .isOverridden(false)
                                        .build());

                        // ── STEP 2: Grade Peer Reviews (Save finalScore in PeerReview) & Update
                        // Submission status ──
                        log.info("Step 2: Grading Peer Reviews and updating Submission status...");

                        // Learner 2 grades Learner 1
                        pr1.setCriteriaScores(rubrics1);
                        pr1.setFinalScore(10);
                        pr1.setComments("Bài làm rất xuất sắc, code chuẩn convention OOP, đóng gói và kế thừa rất mạch lạc!");
                        pr1.setReviewAt(LocalDateTime.now().minusDays(6));
                        peerReviewRepository.save(pr1);

                        sub1.setStatus(SubmissionStatus.GRADED);
                        submissionRepository.save(sub1);

                        // Learner 1 grades Learner 2
                        pr2.setCriteriaScores(rubrics1);
                        pr2.setFinalScore(9);
                        pr2.setComments("Bài nộp trình bày rõ ràng, giải thuật xử lý mảng đối tượng tốt. Cần bổ sung thêm JavaDoc.");
                        pr2.setReviewAt(LocalDateTime.now().minusDays(6));
                        peerReviewRepository.save(pr2);

                        sub2.setStatus(SubmissionStatus.GRADED);
                        submissionRepository.save(sub2);

                        // Learner 4 grades Learner 3
                        pr3.setCriteriaScores(rubrics1);
                        pr3.setFinalScore(9);
                        pr3.setComments("Code sạch, phân chia package hợp lý. Đã áp dụng tốt tính đa hình.");
                        pr3.setReviewAt(LocalDateTime.now().minusDays(6));
                        peerReviewRepository.save(pr3);

                        sub3.setStatus(SubmissionStatus.GRADED);
                        submissionRepository.save(sub3);

                        // Learner 3 grades Learner 4
                        pr4.setCriteriaScores(rubrics1);
                        pr4.setFinalScore(10);
                        pr4.setComments("Bài làm đầy đủ, áp dụng interface tuyệt vời. Đạt tối đa điểm số!");
                        pr4.setReviewAt(LocalDateTime.now().minusDays(6));
                        peerReviewRepository.save(pr4);

                        sub4.setStatus(SubmissionStatus.GRADED);
                        submissionRepository.save(sub4);
                }

                // ── 5. WAITLIST ENROLLMENT FOR COURSE 2 ────────────────────────────
                log.info("Seeding Waitlist Enrollment for Course 2 (learners 2 to 10)...");

                Waitlist springWaitlist = waitlistRepository.save(Waitlist.builder()
                                .course(course2)
                                .createdAt(LocalDateTime.now().minusDays(15))
                                .status(WaitlistStatus.OPENING)
                                .build());

                for (int i = 0; i < learnersToEnroll.size(); i++) {
                        waitlistEntryRepository.save(WaitlistEntry.builder()
                                        .waitlist(springWaitlist)
                                        .user(learnersToEnroll.get(i))
                                        .enrolledAt(LocalDateTime.now().minusDays(15 - i))
                                        .build());
                }

                log.info("=== CourseDataInitializer completed successfully ===");
        }

        private Course createCourseWithModules(
                        String title,
                        String description,
                        CourseStatus status,
                        User creator,
                        String topicPrefix) {

                Course course = courseRepository.save(Course.builder()
                                .title(title)
                                .description(description)
                                .status(status)
                                .createdAt(LocalDateTime.now())
                                .creator(creator)
                                .isDeleted(false)
                                .build());

                String defaultYoutubeUrl = "https://www.youtube.com/watch?v=LSEYdU8Dp9Y";

                for (int m = 1; m <= 4; m++) {
                        String moduleTitle = switch (m) {
                                case 1 -> "Module 1: Nền tảng & Cấu trúc " + topicPrefix;
                                case 2 -> "Module 2: Kỹ thuật Chuyên sâu " + topicPrefix;
                                case 3 -> "Module 3: Tích hợp Hệ thống & API " + topicPrefix;
                                default -> "Module 4: Đồ án & Thực hành Thực tế " + topicPrefix;
                        };

                        CourseModule module = moduleRepository.save(CourseModule.builder()
                                        .title(moduleTitle)
                                        .priority(m % 2 == 1 ? ModulePriority.HIGH : ModulePriority.MEDIUM)
                                        .days(7)
                                        .baseExp(100 + m * 20)
                                        .speedBonusExp(30 + m * 10)
                                        .sortOrder(m)
                                        .course(course)
                                        .build());

                        // 4 Lessons per module
                        for (int l = 1; l <= 4; l++) {
                                String lessonTitle = switch (l) {
                                        case 1 ->
                                                "Bài " + l + ": Giới thiệu & Cài đặt môi trường (" + topicPrefix + ")";
                                        case 2 -> "Bài " + l + ": Khái niệm cốt lõi & Cú pháp (" + topicPrefix + ")";
                                        case 3 -> "Bài " + l + ": Xử lý luồng dữ liệu & Kỹ thuật nâng cao";
                                        default -> "Bài " + l + ": Best Practices & Tổng kết Module " + m;
                                };

                                lessonRepository.save(Lesson.builder()
                                                .module(module)
                                                .title(lessonTitle)
                                                .contentType(LessonContentType.VIDEO)
                                                .contentUrl(defaultYoutubeUrl)
                                                .sortOrder(l)
                                                .build());
                        }

                        // 1 Assignment per module
                        List<RubricCriteriaDto> rubrics = List.of(
                                        new RubricCriteriaDto("Tính đúng đắn",
                                                        "Chương trình chạy chính xác theo yêu cầu bài toán", 5),
                                        new RubricCriteriaDto("Cấu trúc Code",
                                                        "Code sạch, tuân thủ convention và dễ bảo trì", 3),
                                        new RubricCriteriaDto("Tối ưu & Hiệu năng",
                                                        "Sử dụng thuật toán và bộ nhớ hiệu quả", 2));

                        assignmentRepository.save(Assignment.builder()
                                        .title("Bài tập Module " + m + ": Thực hành " + topicPrefix)
                                        .description("Yêu cầu: Hoàn thành bài tập thực hành thuộc Module " + m
                                                        + " của khóa học '" + title
                                                        + "'. Đảm bảo tuân thủ các tiêu chí chấm điểm.")
                                        .rubricCriteria(rubrics)
                                        .module(module)
                                        .build());
                }

                return course;
        }
}
