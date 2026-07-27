package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;
import org.eduspace.backend.dto.mentor.response.MentorClassResponse;
import org.eduspace.backend.dto.mentor.response.MentorClassDetailResponse;
import org.eduspace.backend.dto.mentor.response.MentorResponse;
import org.eduspace.backend.dto.mentor.response.MentorModuleResponse;
import org.eduspace.backend.dto.mentor.response.MentorModuleContentResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.MentorStatus;
import org.eduspace.backend.dto.mentor.response.ActiveMentorResponse;
import org.eduspace.backend.exception.BadRequestException;
import org.eduspace.backend.repository.*;
import org.eduspace.backend.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.LinkedHashSet;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CertificateRepository certificateRepository;
    private final ClassRepository classRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupService studyGroupService;
    private final SubmissionRepository submissionRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassTimelineRepository classTimelineRepository;

    @Transactional
    public void assignMentorToCourse(Long userId, Long courseId) {
        // 1. Kiểm tra điều kiện: Chỉ những người đã hoàn thành khóa học (có chứng chỉ) mới được làm Mentor
        boolean hasCompleted = certificateRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!hasCompleted) {
            throw new BadRequestException("Bạn chưa hoàn thành khóa học này, không thể đăng ký làm Mentor!");
        }

        // 2. Kiểm tra giới hạn 2 lớp đang hoạt động của Mentor
        long activeClassesCount = classMemberRepository.countActiveClassesForMentor(userId);
        if (activeClassesCount >= 2) {
            throw new BadRequestException("Bạn đã đạt giới hạn tối đa 2 lớp học hoạt động đồng thời!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy thông tin người dùng"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy khóa học"));

        // 3. Đăng ký / Cập nhật cấu hình ActiveMentor
        ActiveMentor activeMentor = activeMentorRepository.findByUserIdAndCourseId(userId, courseId)
                .orElse(ActiveMentor.builder().user(user).course(course).build());
        activeMentor.setMentorStatus(MentorStatus.AVAILABLE);
        activeMentorRepository.save(activeMentor);

        // 4. Tự động sắp xếp Mentor vào 1 lớp học phù hợp thuộc khóa học này
        List<CourseClass> candidateClasses = classRepository.findByCourseId(courseId).stream()
                .filter(cc -> cc.getStatus() != org.eduspace.backend.enums.ClassStatus.COMPLETED)
                .filter(cc -> classMemberRepository.findByCourseClassIdAndUserIdAndContextRole(cc.getId(), userId, "MENTOR").isEmpty())
                .sorted((c1, c2) -> {
                    long count1 = classMemberRepository.countActiveMentorsInClass(c1.getId());
                    long count2 = classMemberRepository.countActiveMentorsInClass(c2.getId());
                    return Long.compare(count1, count2);
                })
                .toList();

        if (!candidateClasses.isEmpty()) {
            CourseClass targetClass = candidateClasses.get(0);
            classMemberRepository.save(ClassMember.builder()
                    .courseClass(targetClass)
                    .user(user)
                    .contextRole("MENTOR")
                    .learnerStatus(org.eduspace.backend.enums.LearnerStatus.ACTIVE)
                    .joinedAt(LocalDateTime.now())
                    .build());
        }
    }

    public MentorDashboardResponse getDashboardData(Long userId) {

        long inProgressIncidents = incidentRepository.countByResolvedByUserIdAndStatus(userId,
                IncidentStatus.IN_PROGRESS);

        List<IncidentStatus> resolvedStatuses = Arrays.asList(IncidentStatus.RESOLVED, IncidentStatus.REJECTED,
                IncidentStatus.CLOSED);
        long resolvedIncidents = incidentRepository.countByResolvedByUserIdAndStatusIn(userId,
                resolvedStatuses);

        // Count classes where user is MENTOR or acting as CREATOR-mentor
        long mentorClasses = classMemberRepository.countByUserIdAndContextRole(userId, "MENTOR");
        long creatorMentorClasses = classMemberRepository.countByUserIdAndContextRole(userId, "CREATOR");
        long assignedClasses = mentorClasses + creatorMentorClasses;

        long assignedCourses = activeMentorRepository.countByUserId(userId);

        return MentorDashboardResponse.builder()
                .inProgressIncidents(inProgressIncidents)
                .resolvedIncidents(resolvedIncidents)
                .assignedClasses(assignedClasses)
                .assignedCourses(assignedCourses)
                .build();
    }

    public List<MentorClassResponse> getMentorClasses(Long userId) {
        List<ClassMember> classMembers = classMemberRepository.findByUserIdAndContextRoleIn(userId,
                Arrays.asList("MENTOR", "CREATOR"));
        return classMembers.stream()
                .map(cm -> {
                    CourseClass cc = cm.getCourseClass();
                    List<StudyGroup> groups = studyGroupRepository.findByCourseClassId(cc.getId());
                    long numberOfPairs = groups.size();
                    return MentorClassResponse.builder()
                            .id(cc.getId())
                            .name(cc.getName())
                            .activatedAt(cc.getActivatedAt())
                            .status(cc.getStatus())
                            .courseId(cc.getCourse().getId())
                            .courseTitle(cc.getCourse().getTitle())
                            .numberOfPairs(numberOfPairs)
                            .studyGroups(
                                    groups.stream()
                                            .map(group -> StudyGroupResponse.builder()
                                                    .studyGroupId(group.getId())
                                                    .status(group.getChatStatus())
                                                    .build())
                                            .collect(Collectors.toList()))
                            .membershipStatus(cm.getLearnerStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public MentorClassDetailResponse getMentorClassDetail(Long classId, Long userId) {
        // Check if user is mentor or creator-acting-as-mentor in this class
        ClassMember currentCm = classMemberRepository
                .findByUserIdAndCourseClassIdAndContextRoleIn(userId, classId, Arrays.asList("MENTOR", "CREATOR"))
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này"));

        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        List<ClassMember> mentors = classMemberRepository.findAllMentorsInClass(classId);

        List<MentorResponse> mentorResponses = mentors.stream()
                .map(m -> MentorResponse.builder()
                        .id(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .email(m.getUser().getEmail())
                        .avatarUrl(m.getUser().getAvatarUrl())
                        .build())
                .collect(Collectors.toList());

        long numberOfPairs = studyGroupRepository.findByCourseClassId(classId).size();

        // Fetch Modules for the Course
        List<CourseModule> courseModules = moduleRepository.findByCourseIdOrderBySortOrder(cc.getCourse().getId());

        // Fetch Active learners in class to calculate completion rate
        List<ClassMember> activeLearners = classMemberRepository.findByCourseClassId(classId).stream()
                .filter(cm -> cm.getContextRole().equals("LEARNER")
                        && cm.getLearnerStatus() == org.eduspace.backend.enums.LearnerStatus.ACTIVE)
                .collect(Collectors.toList());

        List<MentorModuleResponse> moduleResponses = new java.util.ArrayList<>();
        boolean previousCompleted = true;
        LocalDateTime now = LocalDateTime.now();

        for (int idx = 0; idx < courseModules.size(); idx++) {
            CourseModule module = courseModules.get(idx);

            // Calculate Status
            String status = "LOCKED";
            LocalDateTime dueDate = classTimelineRepository.findByCourseClassIdAndModuleId(classId, module.getId());
            if (dueDate != null) {
                if (now.isAfter(dueDate)) {
                    status = "COMPLETED";
                } else if (previousCompleted) {
                    status = "ACTIVE";
                }
            } else {
                if (idx == 0)
                    status = "ACTIVE";
            }
            previousCompleted = "COMPLETED".equals(status);

            // Calculate Completion Rate across class members
            double completionRate = 0.0;
            if (!activeLearners.isEmpty()) {
                long totalLessons = lessonRepository.countByModuleId(module.getId());
                Optional<Assignment> assignOpt = assignmentRepository.findByModuleId(module.getId());
                long totalUnitsPerLearner = totalLessons + (assignOpt.isPresent() ? 1 : 0);

                if (totalUnitsPerLearner > 0) {
                    double totalProgressSum = 0.0;
                    for (ClassMember cm : activeLearners) {
                        long completedLessons = lessonProgressRepository
                                .countCompletedLessonsByClassMemberIdAndModuleId(cm.getId(), module.getId());
                        long completedAssignments = 0;
                        if (assignOpt.isPresent()) {
                            completedAssignments = submissionRepository
                                    .findByMemberIdAndAssignmentId(cm.getId(), assignOpt.get().getId())
                                    .map(sub -> sub.getStatus() == org.eduspace.backend.enums.SubmissionStatus.GRADED
                                            ? 1
                                            : 0)
                                    .orElse(0);
                        }
                        totalProgressSum += (double) (completedLessons + completedAssignments) / totalUnitsPerLearner;
                    }
                    completionRate = (totalProgressSum / activeLearners.size()) * 100;
                    completionRate = Math.round(completionRate * 10) / 10.0;
                }
            }

            // Fetch Contents (Lessons and Assignments)
            List<MentorModuleContentResponse> contents = new java.util.ArrayList<>();
            List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());
            for (Lesson lesson : lessons) {
                String type = "Bài học";
                String titleLower = lesson.getTitle().toLowerCase();
                if (titleLower.contains("thực hành") || titleLower.contains("thuc hanh")
                        || titleLower.contains("practice") || titleLower.contains("lab")) {
                    type = "Thực hành";
                }
                contents.add(new MentorModuleContentResponse(type, lesson.getTitle()));
            }

            assignmentRepository.findByModuleId(module.getId()).ifPresent(assignment -> {
                contents.add(new MentorModuleContentResponse("Bài tập", assignment.getTitle()));
            });

            // Map DTO
            moduleResponses.add(MentorModuleResponse.builder()
                    .id((long) (idx + 1))
                    .title(module.getTitle())
                    .status(status)
                    .completionRate(completionRate)
                    .contents(contents)
                    .build());
        }

        return MentorClassDetailResponse.builder()
                .id(cc.getId())
                .name(cc.getName())
                .activatedAt(cc.getActivatedAt())
                .status(cc.getStatus())
                .courseId(cc.getCourse().getId())
                .courseTitle(cc.getCourse().getTitle())
                .courseDescription(cc.getCourse().getDescription())
                .mentors(mentorResponses)
                .numberOfPairs(numberOfPairs)
                .modules(moduleResponses)
                .membershipStatus(currentCm.getLearnerStatus())
                .build();
    }

    public List<StudyGroupResponse> getMentorClassPairs(Long classId, Long userId) {
        classMemberRepository
                .findByUserIdAndCourseClassIdAndContextRoleIn(userId, classId, Arrays.asList("MENTOR", "CREATOR"))
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này"));

        return studyGroupService.getAllStudyGroup(classId);
    }

    public List<ActiveMentorResponse> getActiveCoursesForMentor(Long userId) {
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        List<Course> completedCourses = certificates.stream().map(Certificate::getCourse).toList();

        List<ActiveMentor> activeRegistrations = activeMentorRepository.findByUserId(userId);
        Map<Long, ActiveMentor> regMap = activeRegistrations.stream()
                .collect(Collectors.toMap(
                        am -> am.getCourse().getId(),
                        am -> am,
                        (existing, replacement) -> existing));

        Set<Course> allCourses = new LinkedHashSet<>(completedCourses);
        for (ActiveMentor am : activeRegistrations) {
            allCourses.add(am.getCourse());
        }

        return allCourses.stream().map(course -> {
            ActiveMentor am = regMap.get(course.getId());
            return ActiveMentorResponse.builder()
                    .courseId(course.getId())
                    .courseTitle(course.getTitle())
                    .isRegistered(am != null)
                    .status(am != null ? am.getMentorStatus() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateActiveMentorStatus(Long userId, Long courseId, MentorStatus status) {
        ActiveMentor am = activeMentorRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new BadRequestException("Bạn chưa đăng ký làm Mentor cho khóa học này"));
        am.setMentorStatus(status);
        activeMentorRepository.save(am);
    }
}
