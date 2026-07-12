package org.eduspace.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.*;
import org.eduspace.backend.repository.*;
import org.eduspace.backend.dto.course.RubricCriteriaDto;
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
  private final SubmissionRepository submissionRepository;
  private final PeerReviewRepository peerReviewRepository;
  private final ActiveMentorRepository activeMentorRepository;
  private final IncidentRepository incidentRepository;
  private final RescueRequestRepository rescueRequestRepository;
  private final CertificateRepository certificateRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {
    if (userRepository.count() > 0) {
      log.info("Database already initialized. Checking for missing active mentors...");
      userRepository.findByUsername("mentor1").ifPresent(user -> {
        if (user.getRole() != Role.MENTOR) {
          user.setRole(Role.MENTOR);
          userRepository.save(user);
          log.info("Updated role of mentor1 to MENTOR");
        }
      });
      userRepository.findByUsername("mentor2").ifPresent(user -> {
        if (user.getRole() != Role.MENTOR) {
          user.setRole(Role.MENTOR);
          userRepository.save(user);
          log.info("Updated role of mentor2 to MENTOR");
        }
      });

      if (activeMentorRepository.count() == 0) {
        log.info("Seeding active mentors for existing database...");
        User m1 = userRepository.findByUsername("mentor1").orElse(null);
        User m2 = userRepository.findByUsername("mentor2").orElse(null);
        Course cJava = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Java")).findFirst().orElse(null);
        Course cReact = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("React")).findFirst().orElse(null);

        if (m1 != null && cJava != null) {
          if (!certificateRepository.existsByUserIdAndCourseId(m1.getId(), cJava.getId())) {
            certificateRepository.save(Certificate.builder().user(m1).course(cJava).issuedAt(LocalDateTime.now().minusDays(10)).build());
          }
          activeMentorRepository.save(ActiveMentor.builder().user(m1).course(cJava).mentorStatus(MentorStatus.AVAILABLE).build());
        }
        if (m2 != null && cReact != null) {
          if (!certificateRepository.existsByUserIdAndCourseId(m2.getId(), cReact.getId())) {
            certificateRepository.save(Certificate.builder().user(m2).course(cReact).issuedAt(LocalDateTime.now().minusDays(10)).build());
          }
          activeMentorRepository.save(ActiveMentor.builder().user(m2).course(cReact).mentorStatus(MentorStatus.AVAILABLE).build());
        }
      }
      ensureMockMentorData();
      return;
    }

    log.info("Initializing database with test data...");

    // 1. Seed Users
    log.info("Seeding users...");
    User admin = User.builder()
        .fullName("EduSpace Admin")
        .username("admin")
        .password(passwordEncoder.encode("password123"))
        .email("admin@eduspace.org")
        .role(Role.ADMIN)
        .status(UserStatus.ACTIVE)
        .authProvider(AuthProvider.LOCAL)
        .createdAt(LocalDateTime.now())
        .totalExp(100)
        .build();
    userRepository.save(admin);

    User creator1 = User.builder()
        .fullName("Dr. Nguyễn Văn A")
        .username("creator1")
        .password(passwordEncoder.encode("password123"))
        .email("creator1@eduspace.org")
        .role(Role.CREATOR)
        .status(UserStatus.ACTIVE)
        .authProvider(AuthProvider.LOCAL)
        .createdAt(LocalDateTime.now())
        .bio("Giảng viên Công nghệ thông tin có 10 năm kinh nghiệm giảng dạy Java và lập trình Web.")
        .totalExp(200)
        .build();
    userRepository.save(creator1);

    User creator2 = User.builder()
        .fullName("Prof. Trần Thị B")
        .username("creator2")
        .password(passwordEncoder.encode("password123"))
        .email("creator2@eduspace.org")
        .role(Role.CREATOR)
        .status(UserStatus.ACTIVE)
        .authProvider(AuthProvider.LOCAL)
        .createdAt(LocalDateTime.now())
        .bio("Chuyên gia Trí tuệ nhân tạo và thiết kế UI/UX.")
        .totalExp(150)
        .build();
    userRepository.save(creator2);

    User mentor1 = User.builder()
        .fullName("Mentor Hoàng Văn C")
        .username("mentor1")
        .password(passwordEncoder.encode("password123"))
        .email("mentor1@eduspace.org")
        .role(Role.MENTOR)
        .status(UserStatus.ACTIVE)
        .authProvider(AuthProvider.LOCAL)
        .createdAt(LocalDateTime.now())
        .totalExp(150)
        .build();
    userRepository.save(mentor1);

    User mentor2 = User.builder()
        .fullName("Mentor Hoàng Thị D")
        .username("mentor2")
        .password(passwordEncoder.encode("password123"))
        .email("mentor2@eduspace.org")
        .role(Role.MENTOR)
        .status(UserStatus.ACTIVE)
        .authProvider(AuthProvider.LOCAL)
        .createdAt(LocalDateTime.now())
        .totalExp(120)
        .build();
    userRepository.save(mentor2);

    List<User> learners = new ArrayList<>();
    for (int i = 1; i <= 10; i++) {
      User learner = User.builder()
          .fullName("Học viên EduSpace " + i)
          .username("learner" + i)
          .password(passwordEncoder.encode("password123"))
          .email("learner" + i + "@eduspace.org")
          .role(Role.LEARNER)
          .status(UserStatus.ACTIVE)
          .authProvider(AuthProvider.LOCAL)
          .createdAt(LocalDateTime.now())
          .totalExp(i * 30)
          .build();
      learners.add(userRepository.save(learner));
    }

    // 2. Seed Courses
    log.info("Seeding courses...");
    Course courseJava = Course.builder()
        .title("Lập trình Java hướng đối tượng (OOP)")
        .description(
            "Khóa học cung cấp kiến thức nền tảng về ngôn ngữ lập trình Java và 4 tính chất cốt lõi của lập trình hướng đối tượng.")
        .status(CourseStatus.PUBLISHED)
        .createdAt(LocalDateTime.now())
        .creator(creator1)
        .isDeleted(false)
        .build();
    courseRepository.save(courseJava);

    Course courseReact = Course.builder()
        .title("Xây dựng ứng dụng Web với React & Node.js")
        .description(
            "Học cách xây dựng giao diện người dùng hiện đại với React và backend API mạnh mẽ bằng Express/Node.js.")
        .status(CourseStatus.PUBLISHED)
        .createdAt(LocalDateTime.now())
        .creator(creator1)
        .isDeleted(false)
        .build();
    courseRepository.save(courseReact);

    Course courseML = Course.builder()
        .title("Machine Learning cơ bản")
        .description(
            "Giới thiệu các thuật toán Học máy phổ biến như Linear Regression, Decision Tree và K-Means clustering.")
        .status(CourseStatus.PENDING)
        .createdAt(LocalDateTime.now())
        .creator(creator2)
        .isDeleted(false)
        .build();
    courseRepository.save(courseML);

    Course courseUIUX = Course.builder()
        .title("Thiết kế giao diện người dùng UI/UX")
        .description("Hướng dẫn các nguyên lý thiết kế đồ họa, wireframing và prototyping sử dụng công cụ Figma.")
        .status(CourseStatus.DRAFT)
        .createdAt(LocalDateTime.now())
        .creator(creator2)
        .isDeleted(false)
        .build();
    courseRepository.save(courseUIUX);

    // 3. Seed Modules
    log.info("Seeding modules...");
    CourseModule javaModule1 = CourseModule.builder()
        .title("Cú pháp Java & Biến")
        .priority(ModulePriority.HIGH)
        .days(7)
        .baseExp(100)
        .speedBonusExp(50)
        .sortOrder(1)
        .course(courseJava)
        .build();
    moduleRepository.save(javaModule1);

    CourseModule javaModule2 = CourseModule.builder()
        .title("Lập trình hướng đối tượng (OOP)")
        .priority(ModulePriority.HIGH)
        .days(10)
        .baseExp(150)
        .speedBonusExp(75)
        .sortOrder(2)
        .course(courseJava)
        .build();
    moduleRepository.save(javaModule2);

    CourseModule javaModule3 = CourseModule.builder()
        .title("Collections Framework")
        .priority(ModulePriority.MEDIUM)
        .days(5)
        .baseExp(100)
        .speedBonusExp(40)
        .sortOrder(3)
        .course(courseJava)
        .build();
    moduleRepository.save(javaModule3);

    CourseModule reactModule1 = CourseModule.builder()
        .title("Tổng quan về React & Component")
        .priority(ModulePriority.HIGH)
        .days(7)
        .baseExp(100)
        .speedBonusExp(50)
        .sortOrder(1)
        .course(courseReact)
        .build();
    moduleRepository.save(reactModule1);

    CourseModule reactModule2 = CourseModule.builder()
        .title("State, Props & Hooks")
        .priority(ModulePriority.HIGH)
        .days(7)
        .baseExp(100)
        .speedBonusExp(50)
        .sortOrder(2)
        .course(courseReact)
        .build();
    moduleRepository.save(reactModule2);

    // 4. Seed Lessons
    log.info("Seeding lessons...");
    Lesson javaLesson1 = Lesson.builder()
        .module(javaModule1)
        .title("Bài 1: Giới thiệu ngôn ngữ Java và JDK")
        .contentType(LessonContentType.VIDEO)
        .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
        .sortOrder(1)
        .build();
    lessonRepository.save(javaLesson1);

    Lesson javaLesson2 = Lesson.builder()
        .module(javaModule1)
        .title("Bài 2: Các kiểu dữ liệu cơ bản và Biến")
        .contentType(LessonContentType.DOCUMENT)
        .contentUrl("https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html")
        .sortOrder(2)
        .build();
    lessonRepository.save(javaLesson2);

    Lesson javaLesson3 = Lesson.builder()
        .module(javaModule1)
        .title("Bài 3: Cấu trúc điều khiển (if-else, switch-case)")
        .contentType(LessonContentType.TEXT)
        .contentUrl("Hãy tìm hiểu các cấu trúc rẽ nhánh if-else và switch-case trong Java...")
        .sortOrder(3)
        .build();
    lessonRepository.save(javaLesson3);

    Lesson javaLesson4 = Lesson.builder()
        .module(javaModule2)
        .title("Bài 1: Lớp (Class) và Đối tượng (Object)")
        .contentType(LessonContentType.VIDEO)
        .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
        .sortOrder(1)
        .build();
    lessonRepository.save(javaLesson4);

    Lesson javaLesson5 = Lesson.builder()
        .module(javaModule2)
        .title("Bài 2: Tính Đóng gói (Encapsulation)")
        .contentType(LessonContentType.DOCUMENT)
        .contentUrl("https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html")
        .sortOrder(2)
        .build();
    lessonRepository.save(javaLesson5);

    Lesson reactLesson1 = Lesson.builder()
        .module(reactModule1)
        .title("Bài 1: Virtual DOM là gì?")
        .contentType(LessonContentType.TEXT)
        .contentUrl("React sử dụng Virtual DOM để tối ưu hiệu năng render...")
        .sortOrder(1)
        .build();
    lessonRepository.save(reactLesson1);

    // Lessons cho Module 3 (Collections)
    Lesson javaLesson6 = Lesson.builder()
        .module(javaModule3)
        .title("Bài 1: ArrayList và LinkedList")
        .contentType(LessonContentType.VIDEO)
        .contentUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
        .sortOrder(1)
        .build();
    lessonRepository.save(javaLesson6);

    Lesson javaLesson7 = Lesson.builder()
        .module(javaModule3)
        .title("Bài 2: HashMap và HashSet")
        .contentType(LessonContentType.DOCUMENT)
        .contentUrl("https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html")
        .sortOrder(2)
        .build();
    lessonRepository.save(javaLesson7);

    // 5. Seed Assignments
    log.info("Seeding assignments...");
    List<RubricCriteriaDto> rubricJava1 = List.of(
        new RubricCriteriaDto("Chạy đúng", "Chương trình biên dịch và chạy không lỗi", 5),
        new RubricCriteriaDto("Cú pháp chuẩn", "Đặt tên biến và đặt cấu trúc code đúng quy chuẩn", 3),
        new RubricCriteriaDto("Hiệu năng", "Sử dụng bộ nhớ tối ưu", 2));

    Assignment javaAssign1 = Assignment.builder()
        .title("Bài tập cú pháp Java cơ bản")
        .description("Viết chương trình tính giai thừa của một số nguyên và kiểm tra số nguyên tố.")
        .rubricCriteria(rubricJava1)
        .module(javaModule1)
        .build();
    assignmentRepository.save(javaAssign1);

    List<RubricCriteriaDto> rubricJava2 = List.of(
        new RubricCriteriaDto("Tính kế thừa", "Sử dụng từ khóa extends và override đúng cách", 4),
        new RubricCriteriaDto("Tính đóng gói", "Sử dụng private fields kết hợp getters/setters", 3),
        new RubricCriteriaDto("Tính đa hình", "Demonstrate polymorphism qua method overriding", 3));

    Assignment javaAssign2 = Assignment.builder()
        .title("Thiết kế lớp học OOP đơn giản")
        .description(
            "Xây dựng sơ đồ lớp cho một hệ thống quản lý thư viện cơ bản bao gồm Sách, Độc giả, và Phiếu mượn.")
        .rubricCriteria(rubricJava2)
        .module(javaModule2)
        .build();
    assignmentRepository.save(javaAssign2);

    List<RubricCriteriaDto> rubricJava3 = List.of(
        new RubricCriteriaDto("Cấu trúc code", "Sử dụng Collection đúng loại cho từng bài toán", 5),
        new RubricCriteriaDto("Hiệu năng", "Lựa chọn Collection phù hợp về time complexity", 5));

    Assignment javaAssign3 = Assignment.builder()
        .title("Bài tập Collections Framework")
        .description("Viết chương trình quản lý danh sách sinh viên sử dụng ArrayList và HashMap.")
        .rubricCriteria(rubricJava3)
        .module(javaModule3)
        .build();
    assignmentRepository.save(javaAssign3);

    // 6. Seed Waitlists & Waitlist Entries
    log.info("Seeding waitlists...");
    Waitlist waitlistReact = Waitlist.builder()
        .course(courseReact)
        .createdAt(LocalDateTime.now())
        .status(WaitlistStatus.OPENING)
        .build();
    waitlistRepository.save(waitlistReact);

    for (int i = 0; i < 3; i++) {
      WaitlistEntry entry = WaitlistEntry.builder()
          .waitlist(waitlistReact)
          .user(learners.get(i))
          .enrolledAt(LocalDateTime.now().minusDays(i))
          .build();
      waitlistEntryRepository.save(entry);
    }

    // 7. Seed Classes & Class Members
    log.info("Seeding classes and class members...");
    CourseClass javaClass = CourseClass.builder()
        .name("Lớp Java OOP - K20")
        .activatedAt(LocalDateTime.now().minusDays(5))
        .status(ClassStatus.RUNNING)
        .course(courseJava)
        .build();
    classRepository.save(javaClass);

    List<ClassMember> javaClassMembers = new ArrayList<>();
    for (int i = 0; i < 5; i++) {
      ClassMember member = ClassMember.builder()
          .courseClass(javaClass)
          .user(learners.get(i))
          .contextRole("LEARNER")
          .learnerStatus(LearnerStatus.ACTIVE)
          .joinedAt(LocalDateTime.now().minusDays(5))
          .build();
      javaClassMembers.add(classMemberRepository.save(member));
    }

    ClassMember javaMentor = ClassMember.builder()
        .courseClass(javaClass)
        .user(mentor1)
        .contextRole("MENTOR")
        .learnerStatus(LearnerStatus.ACTIVE)
        .joinedAt(LocalDateTime.now().minusDays(5))
        .build();
    classMemberRepository.save(javaMentor);

    CourseClass reactClass = CourseClass.builder()
        .name("Lớp React Web - K05")
        .activatedAt(LocalDateTime.now().minusDays(1))
        .status(ClassStatus.UPCOMING)
        .course(courseReact)
        .build();
    classRepository.save(reactClass);

    for (int i = 5; i < 10; i++) {
      ClassMember member = ClassMember.builder()
          .courseClass(reactClass)
          .user(learners.get(i))
          .contextRole("LEARNER")
          .learnerStatus(LearnerStatus.ACTIVE)
          .joinedAt(LocalDateTime.now().minusDays(1))
          .build();
      classMemberRepository.save(member);
    }

    ClassMember reactMentor = ClassMember.builder()
        .courseClass(reactClass)
        .user(mentor2)
        .contextRole("MENTOR")
        .learnerStatus(LearnerStatus.ACTIVE)
        .joinedAt(LocalDateTime.now().minusDays(1))
        .build();
    classMemberRepository.save(reactMentor);

    // 8. Seed Study Groups & Group Members
    log.info("Seeding study groups and group members...");
    StudyGroup group1 = StudyGroup.builder()
        .courseClass(javaClass)
        .module(javaModule3) // Cho pair learning ở Module 3 (cuối)
        .chatChannelId("channel_java_group_1")
        .chatStatus("ACTIVE")
        .build();
    studyGroupRepository.save(group1);

    GroupMember gm1 = GroupMember.builder()
        .studyGroup(group1)
        .classMember(javaClassMembers.get(0))
        .build();
    groupMemberRepository.save(gm1);

    GroupMember gm2 = GroupMember.builder()
        .studyGroup(group1)
        .classMember(javaClassMembers.get(1))
        .build();
    groupMemberRepository.save(gm2);

    StudyGroup group2 = StudyGroup.builder()
        .courseClass(javaClass)
        .module(javaModule3)
        .chatChannelId("channel_java_group_2")
        .chatStatus("ACTIVE")
        .build();
    studyGroupRepository.save(group2);

    GroupMember gm3 = GroupMember.builder()
        .studyGroup(group2)
        .classMember(javaClassMembers.get(2))
        .build();
    groupMemberRepository.save(gm3);

    GroupMember gm4 = GroupMember.builder()
        .studyGroup(group2)
        .classMember(javaClassMembers.get(3))
        .build();
    groupMemberRepository.save(gm4);

    // 8.5 Seed Certificates for Mentors
    log.info("Seeding certificates for mentors...");
    Certificate cert1 = Certificate.builder()
        .user(mentor1)
        .course(courseJava)
        .issuedAt(LocalDateTime.now().minusDays(10))
        .build();
    certificateRepository.save(cert1);

    Certificate cert2 = Certificate.builder()
        .user(mentor2)
        .course(courseReact)
        .issuedAt(LocalDateTime.now().minusDays(10))
        .build();
    certificateRepository.save(cert2);

    // 9. Seed Active Mentors (Verifying completion check)
    log.info("Seeding active mentors...");
    if (certificateRepository.existsByUserIdAndCourseId(mentor1.getId(), courseJava.getId())) {
        ActiveMentor am1 = ActiveMentor.builder()
            .user(mentor1)
            .course(courseJava)
            .mentorStatus(MentorStatus.AVAILABLE)
            .build();
        activeMentorRepository.save(am1);
    }

    if (certificateRepository.existsByUserIdAndCourseId(mentor2.getId(), courseReact.getId())) {
        ActiveMentor am2 = ActiveMentor.builder()
            .user(mentor2)
            .course(courseReact)
            .mentorStatus(MentorStatus.AVAILABLE)
            .build();
        activeMentorRepository.save(am2);
    }

    // 10. Seed Incidents
    log.info("Seeding incidents...");
    Incident inc1 = Incident.builder()
        .incidentType(IncidentType.PEER_REVIEW_DISPUTE)
        .reporter(javaClassMembers.get(0))
        .reported(javaClassMembers.get(1))
        .reason("Học viên chấm điểm chéo không khách quan, đánh giá sai lệch bài tập Java.")
        .status(IncidentStatus.PENDING)
        .createdAt(LocalDateTime.now())
        .build();
    incidentRepository.save(inc1);

    Incident inc2 = Incident.builder()
        .incidentType(IncidentType.INACTIVE_PARTNER)
        .reporter(javaClassMembers.get(2))
        .reported(javaClassMembers.get(3))
        .reason("Bạn học cùng nhóm đã không online 5 ngày qua, không phản hồi tin nhắn làm bài tập nhóm.")
        .status(IncidentStatus.IN_PROGRESS)
        .createdAt(LocalDateTime.now().minusDays(1))
        .build();
    incidentRepository.save(inc2);

    // 11. Seed Rescue Requests
    log.info("Seeding rescue requests...");
    RescueRequest rr1 = RescueRequest.builder()
        .incident(inc1)
        .learner(javaClassMembers.get(0))
        .rescueStartedAt(LocalDateTime.now())
        .rescueDeadline(LocalDateTime.now().plusHours(48))
        .status(RescueStatus.ON_GOING)
        .build();
    rescueRequestRepository.save(rr1);

    log.info("Database initialization completed successfully.");
    ensureMockMentorData();
  }

  private void ensureMockMentorData() {
    log.info("Ensuring mock mentor data (L04, L05, incidents, arbitrations) exists...");

    // 1. Get Courses (Java & React)
    Course courseJava = courseRepository.findAll().stream()
        .filter(c -> c.getTitle().contains("Java") || c.getTitle().contains("OOP"))
        .findFirst()
        .orElse(null);

    Course courseReact = courseRepository.findAll().stream()
        .filter(c -> c.getTitle().contains("React"))
        .findFirst()
        .orElse(null);

    if (courseJava == null || courseReact == null) {
      log.warn("Required courses not found. Skipping mock mentor data seeding.");
      return;
    }

    // 2. Get Modules (for L04, L05 task seeding)
    CourseModule javaModule2 = moduleRepository.findByCourseIdOrderBySortOrder(courseJava.getId()).stream()
        .filter(m -> m.getTitle().contains("OOP"))
        .findFirst()
        .orElse(null);
    if (javaModule2 == null) {
        javaModule2 = moduleRepository.findByCourseIdOrderBySortOrder(courseJava.getId()).stream()
            .findFirst()
            .orElse(null);
    }

    CourseModule reactModule1 = moduleRepository.findByCourseIdOrderBySortOrder(courseReact.getId()).stream()
        .findFirst()
        .orElse(null);

    // 3. Create/Find Mentors
    User mentor1 = userRepository.findByUsername("mentor1").orElse(null);
    if (mentor1 == null) {
        mentor1 = User.builder()
            .fullName("Mentor Hoàng Văn C")
            .username("mentor1")
            .password(passwordEncoder.encode("password123"))
            .email("mentor1@eduspace.org")
            .role(Role.MENTOR)
            .status(UserStatus.ACTIVE)
            .authProvider(AuthProvider.LOCAL)
            .createdAt(LocalDateTime.now())
            .totalExp(150)
            .build();
        mentor1 = userRepository.save(mentor1);
    }
    
    User mentor2 = userRepository.findByUsername("mentor2").orElse(null);
    if (mentor2 == null) {
        mentor2 = User.builder()
            .fullName("Mentor Hoàng Thị D")
            .username("mentor2")
            .password(passwordEncoder.encode("password123"))
            .email("mentor2@eduspace.org")
            .role(Role.MENTOR)
            .status(UserStatus.ACTIVE)
            .authProvider(AuthProvider.LOCAL)
            .createdAt(LocalDateTime.now())
            .totalExp(120)
            .build();
        mentor2 = userRepository.save(mentor2);
    }

    final User finalMentor1 = mentor1;
    final User finalMentor2 = mentor2;

    // Ensure Certificates for Mentors exist
    if (!certificateRepository.existsByUserIdAndCourseId(finalMentor1.getId(), courseJava.getId())) {
        certificateRepository.save(Certificate.builder().user(finalMentor1).course(courseJava).issuedAt(LocalDateTime.now().minusDays(10)).build());
    }
    if (!certificateRepository.existsByUserIdAndCourseId(finalMentor2.getId(), courseReact.getId())) {
        certificateRepository.save(Certificate.builder().user(finalMentor2).course(courseReact).issuedAt(LocalDateTime.now().minusDays(10)).build());
    }

    // Ensure ActiveMentor records exist
    if (activeMentorRepository.findAll().stream().noneMatch(am -> am.getUser().getId().equals(finalMentor1.getId()))) {
        activeMentorRepository.save(ActiveMentor.builder().user(finalMentor1).course(courseJava).mentorStatus(MentorStatus.AVAILABLE).build());
    }
    if (activeMentorRepository.findAll().stream().noneMatch(am -> am.getUser().getId().equals(finalMentor2.getId()))) {
        activeMentorRepository.save(ActiveMentor.builder().user(finalMentor2).course(courseReact).mentorStatus(MentorStatus.AVAILABLE).build());
    }

    // 4. Create Classes: L04 and L05
    CourseClass classL04 = classRepository.findAll().stream()
        .filter(c -> c.getName().equals("Lớp L04"))
        .findFirst()
        .orElse(null);
    if (classL04 == null) {
        classL04 = CourseClass.builder()
            .name("Lớp L04")
            .activatedAt(LocalDateTime.now().minusDays(15))
            .status(ClassStatus.RUNNING)
            .course(courseJava)
            .build();
        classL04 = classRepository.save(classL04);
    }

    CourseClass classL05 = classRepository.findAll().stream()
        .filter(c -> c.getName().equals("Lớp L05"))
        .findFirst()
        .orElse(null);
    if (classL05 == null) {
        classL05 = CourseClass.builder()
            .name("Lớp L05")
            .activatedAt(LocalDateTime.now().minusDays(15))
            .status(ClassStatus.RUNNING)
            .course(courseReact)
            .build();
        classL05 = classRepository.save(classL05);
    }

    // Ensure Mentors are registered as MENTOR ClassMembers
    final CourseClass finalClassL04 = classL04;
    ClassMember mentorCM1 = classMemberRepository.findByUserIdAndCourseClassId(finalMentor1.getId(), classL04.getId())
        .orElseGet(() -> classMemberRepository.save(ClassMember.builder()
            .courseClass(finalClassL04)
            .user(finalMentor1)
            .contextRole("MENTOR")
            .learnerStatus(LearnerStatus.ACTIVE)
            .joinedAt(LocalDateTime.now().minusDays(15))
            .build()));

    final CourseClass finalClassL05 = classL05;
    ClassMember mentorCM2 = classMemberRepository.findByUserIdAndCourseClassId(finalMentor2.getId(), classL05.getId())
        .orElseGet(() -> classMemberRepository.save(ClassMember.builder()
            .courseClass(finalClassL05)
            .user(finalMentor2)
            .contextRole("MENTOR")
            .learnerStatus(LearnerStatus.ACTIVE)
            .joinedAt(LocalDateTime.now().minusDays(15))
            .build()));

    // 5. Create Mock Students for L04
    // Pairs in L04: An & Bình, Chi & Dũng, Hạnh & Phúc, Liên & Minh, Trâm & Uyên
    String[] l04Names = {"An", "Bình", "Chi", "Dũng", "Hạnh", "Phúc", "Liên", "Minh", "Trâm", "Uyên"};
    String[] l04Usernames = {"an", "binh", "chi", "dung", "hanh", "phuc", "lien", "minh_l04", "tram", "uyen"};
    List<ClassMember> l04CMs = new ArrayList<>();

    for (int i = 0; i < l04Names.length; i++) {
        String username = l04Usernames[i];
        String name = l04Names[i];
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = User.builder()
                .fullName(name)
                .username(username)
                .password(passwordEncoder.encode("password123"))
                .email(username + "@eduspace.org")
                .role(Role.LEARNER)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(100)
                .build();
            user = userRepository.save(user);
        }
        final User finalU = user;
        ClassMember cm = classMemberRepository.findByUserIdAndCourseClassId(user.getId(), classL04.getId())
            .orElseGet(() -> classMemberRepository.save(ClassMember.builder()
                .courseClass(finalClassL04)
                .user(finalU)
                .contextRole("LEARNER")
                .learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now().minusDays(15))
                .build()));
        l04CMs.add(cm);
    }

    // 6. Create Mock Students for L05
    // Pairs in L05: Lan & Mai, Nam & Oanh, Phú & Quý, Sơn & Thủy, Tuấn & Vũ
    String[] l05Names = {"Lan", "Mai", "Nam", "Oanh", "Phú", "Quý", "Sơn", "Thủy", "Tuấn", "Vũ"};
    String[] l05Usernames = {"lan", "mai", "nam_l05", "oanh", "phu", "quy", "son", "thuy", "tuan", "vu"};
    List<ClassMember> l05CMs = new ArrayList<>();

    for (int i = 0; i < l05Names.length; i++) {
        String username = l05Usernames[i];
        String name = l05Names[i];
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = User.builder()
                .fullName(name)
                .username(username)
                .password(passwordEncoder.encode("password123"))
                .email(username + "@eduspace.org")
                .role(Role.LEARNER)
                .status(UserStatus.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .createdAt(LocalDateTime.now())
                .totalExp(100)
                .build();
            user = userRepository.save(user);
        }
        final User finalU = user;
        ClassMember cm = classMemberRepository.findByUserIdAndCourseClassId(user.getId(), classL05.getId())
            .orElseGet(() -> classMemberRepository.save(ClassMember.builder()
                .courseClass(finalClassL05)
                .user(finalU)
                .contextRole("LEARNER")
                .learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now().minusDays(15))
                .build()));
        l05CMs.add(cm);
    }

    // 7. Seed Study Groups & Group Members for L04
    for (int i = 0; i < l04CMs.size(); i += 2) {
        ClassMember cm1 = l04CMs.get(i);
        ClassMember cm2 = l04CMs.get(i + 1);
        String channelId = "channel_l04_group_" + (i/2 + 1);
        StudyGroup sg = studyGroupRepository.findByCourseClassId(classL04.getId()).stream()
            .filter(g -> channelId.equals(g.getChatChannelId()))
            .findFirst()
            .orElse(null);
        if (sg == null) {
            sg = studyGroupRepository.save(StudyGroup.builder()
                .courseClass(classL04)
                .module(javaModule2)
                .chatChannelId(channelId)
                .chatStatus("ACTIVE")
                .build());
            groupMemberRepository.save(GroupMember.builder().studyGroup(sg).classMember(cm1).build());
            groupMemberRepository.save(GroupMember.builder().studyGroup(sg).classMember(cm2).build());
        }
    }

    // Seed Study Groups & Group Members for L05
    for (int i = 0; i < l05CMs.size(); i += 2) {
        ClassMember cm1 = l05CMs.get(i);
        ClassMember cm2 = l05CMs.get(i + 1);
        String channelId = "channel_l05_group_" + (i/2 + 1);
        StudyGroup sg = studyGroupRepository.findByCourseClassId(classL05.getId()).stream()
            .filter(g -> channelId.equals(g.getChatChannelId()))
            .findFirst()
            .orElse(null);
        if (sg == null) {
            sg = studyGroupRepository.save(StudyGroup.builder()
                .courseClass(classL05)
                .module(reactModule1)
                .chatChannelId(channelId)
                .chatStatus("ACTIVE")
                .build());
            groupMemberRepository.save(GroupMember.builder().studyGroup(sg).classMember(cm1).build());
            groupMemberRepository.save(GroupMember.builder().studyGroup(sg).classMember(cm2).build());
        }
    }

    // 8. Seed Incidents and Arbitrations
    // incident 1: INC-1024 - PEER_REVIEW_DISPUTE (An vs Minh_l04)
    // We need an assignment for the dispute
    Assignment assignmentBook = assignmentRepository.findByModuleId(javaModule2.getId()).orElse(null);
    if (assignmentBook == null) {
        assignmentBook = assignmentRepository.save(Assignment.builder()
            .title("Speaking Task 2: Describe a book")
            .description("Describe a book you have read recently.")
            .module(javaModule2)
            .build());
    }

    // Create Submission for An
    ClassMember studentAn = l04CMs.get(0); // An
    ClassMember studentBinh = l04CMs.get(1); // Bình
    ClassMember studentChi = l04CMs.get(2); // Chi
    ClassMember studentDung = l04CMs.get(3); // Dũng
    ClassMember studentMinh = l04CMs.get(7); // Minh
    
    ClassMember studentLan = l05CMs.get(0); // Lan
    ClassMember studentMai = l05CMs.get(1); // Mai
    ClassMember studentNam = l05CMs.get(2); // Nam

    final Assignment finalBookAssign = assignmentBook;
    Submission subAn = submissionRepository.findByMemberIdAndAssignmentId(studentAn.getId(), assignmentBook.getId())
        .orElseGet(() -> submissionRepository.save(Submission.builder()
            .assignment(finalBookAssign)
            .member(studentAn)
            .submissionContent("I would like to describe my favorite book, which is 'The Alchemist'. It is a story about a shepherd who travels in search of treasure...")
            .submittedAt(LocalDateTime.now().minusDays(2))
            .status(SubmissionStatus.SUBMITTED)
            .build()));

    // Create PeerReview for subAn by Minh_l04
    GroupMember reviewerMinh = groupMemberRepository.findByClassMemberId(studentMinh.getId()).stream().findFirst().orElse(null);
    if (reviewerMinh != null && peerReviewRepository.findByReviewer_ClassMember_IdAndSubmission_Assignment_Id(studentMinh.getId(), assignmentBook.getId()).isEmpty()) {
        peerReviewRepository.save(PeerReview.builder()
            .submission(subAn)
            .reviewer(reviewerMinh)
            .finalScore(5)
            .comments("Too many pronunciation mistakes due to accent. Hard to understand.")
            .reviewAt(LocalDateTime.now().minusDays(1))
            .build());
    }

    // Create Incident for INC-1024
    if (incidentRepository.findAll().stream().noneMatch(inc -> inc.getReason().contains("chấm Speaking Task 1 của em được 2/10"))) {
        incidentRepository.save(Incident.builder()
            .incidentType(IncidentType.PEER_REVIEW_DISPUTE)
            .submission(subAn)
            .reporter(studentAn)
            .reported(studentMinh)
            .reason("Minh chấm Speaking Task 1 của em được 2/10 điểm vì lý do 'phát âm giọng địa phương khó nghe' dù em đã bám sát các tiêu chí phát âm của Rubric chấm điểm. Mong Mentor xem xét lại giúp em.")
            .evidenceUrl("speaking_audio_v1.mp3")
            .status(IncidentStatus.PENDING)
            .createdAt(LocalDateTime.now().minusMinutes(10))
            .build());
    }

    // incident 2: INC-1025 - INACTIVE_PARTNER
    if (incidentRepository.findAll().stream().noneMatch(inc -> inc.getReason().contains("Bình đã không tham gia học nhóm"))) {
        incidentRepository.save(Incident.builder()
            .incidentType(IncidentType.INACTIVE_PARTNER)
            .reporter(studentChi)
            .reported(studentBinh)
            .reason("Bình đã không tham gia học nhóm và không tương tác trả lời tin nhắn thảo luận làm bài tập trên hệ thống suốt 3 ngày nay.")
            .status(IncidentStatus.PENDING)
            .createdAt(LocalDateTime.now().minusHours(3))
            .build());
    }

    // incident 3: INC-1026 - MEMBER_CONFLICT
    if (incidentRepository.findAll().stream().noneMatch(inc -> inc.getReason().contains("Xung đột ý kiến nghiêm trọng"))) {
        incidentRepository.save(Incident.builder()
            .incidentType(IncidentType.MEMBER_CONFLICT)
            .reporter(studentLan)
            .reported(studentMai)
            .reason("Xung đột ý kiến nghiêm trọng trong quá trình thảo luận bài viết IELTS Writing Task 2. Bạn học dùng từ ngữ không phù hợp trong kênh chat nhóm.")
            .evidenceUrl("screenshot_chat.png")
            .status(IncidentStatus.PENDING)
            .createdAt(LocalDateTime.now().minusDays(2))
            .build());
    }

    // incident 4: INC-1027 - RESCUE_SUPPORT_REQUEST
    if (incidentRepository.findAll().stream().noneMatch(inc -> inc.getReason().contains("Gặp sự cố hỏng máy tính cá nhân"))) {
        Incident resolvedIncident = incidentRepository.save(Incident.builder()
            .incidentType(IncidentType.RESCUE_SUPPORT_REQUEST)
            .reporter(studentNam)
            .reason("Gặp sự cố hỏng máy tính cá nhân đột xuất và xin hỗ trợ cửa sổ cứu trợ nộp bù bài tập Speaking.")
            .evidenceUrl("anh_may_hong.jpg")
            .status(IncidentStatus.RESOLVED)
            .resolvedBy(mentorCM2)
            .resolutionNote("Phê duyệt kích hoạt cửa sổ cứu trợ. Nam đã hoàn thành nộp bài cứu viện và được phục hồi.")
            .createdAt(LocalDateTime.now().minusDays(3))
            .solvedAt(LocalDateTime.now().minusDays(1))
            .build());

        rescueRequestRepository.save(RescueRequest.builder()
            .incident(resolvedIncident)
            .learner(studentNam)
            .rescueStartedAt(LocalDateTime.now().minusDays(3))
            .rescueDeadline(LocalDateTime.now().minusDays(1))
            .status(RescueStatus.SAVED)
            .build());
    }

    log.info("Mock mentor data successfully ensured.");
  }
}
