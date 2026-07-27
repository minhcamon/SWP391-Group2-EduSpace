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
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                if (courseRepository.count() > 0) {
                        log.info("Courses already initialized. Skipping CourseDataInitializer.");
                        return;
                }

                log.info("=== Initializing CourseDataInitializer (Courses, Base Users, Mentors & Course 2 Waitlist) ===");

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

                userRepository.save(User.builder()
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

                List<User> learnersToEnroll = new ArrayList<>();

                User learner2 = userRepository.save(User.builder()
                                .fullName("Học viên Lê Learner 2")
                                .username("learner2")
                                .password(passwordEncoder.encode("password123"))
                                .email("learner2@eduspace.vn")
                                .role(Role.LEARNER)
                                .status(UserStatus.ACTIVE)
                                .authProvider(AuthProvider.LOCAL)
                                .createdAt(LocalDateTime.now())
                                .totalExp(80)
                                .build());
                learnersToEnroll.add(learner2);

                for (int i = 3; i <= 10; i++) {
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
                                "Lập trình Java Căn Bản & Hướng Đối Tượng (OOP)",
                                "Khóa học cung cấp kiến thức nền tảng về Java, cú pháp ngôn ngữ và 4 tính chất cốt lõi của OOP.",
                                CourseStatus.PUBLISHED,
                                creator1,
                                "Java OOP");

                Course course2 = createCourseWithModules(
                                "Lập trình Web với Spring Boot & Microservices",
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

                // ── 4. WAITLIST ENROLLMENT FOR COURSE 2 ────────────────────────────
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
