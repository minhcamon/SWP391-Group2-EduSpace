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
  private final PasswordEncoder passwordEncoder;
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
        .module(javaModule1)
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
        .module(javaModule1)
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
  }
}
