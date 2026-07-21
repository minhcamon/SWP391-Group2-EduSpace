package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.common.PagedResponse;
import org.eduspace.backend.dto.course.request.AdminRejectCourseRequest;
import org.eduspace.backend.dto.course.request.CreateAssignmentRequest;
import org.eduspace.backend.dto.course.request.CreateCourseRequest;
import org.eduspace.backend.dto.course.request.CreateLessonRequest;
import org.eduspace.backend.dto.course.request.CreateModuleRequest;
import org.eduspace.backend.dto.course.request.UpdateAssignmentRequest;
import org.eduspace.backend.dto.course.request.UpdateCourseRequest;
import org.eduspace.backend.dto.course.request.UpdateLessonRequest;
import org.eduspace.backend.dto.course.request.UpdateModuleRequest;
import org.eduspace.backend.dto.course.response.AssignmentResponse;
import org.eduspace.backend.dto.course.response.CourseResponse;
import org.eduspace.backend.dto.course.response.LessonResponse;
import org.eduspace.backend.dto.course.response.ModuleResponse;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.CourseRequest;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.CourseStatus;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.RequestStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.CourseRequestRepository;
import org.eduspace.backend.repository.LessonRepository;
import org.eduspace.backend.repository.ModuleRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.CertificateRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final AssignmentRepository assignmentRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final CourseRequestRepository courseRequestRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationService notificationService;

    public List<CourseResponse> getCoursesByCreatorId(Long creatorId) {
        List<Course> courses = courseRepository.getCoursesByCreatorId(creatorId);

        return courses.stream()
                .map(course -> CourseResponse.builder()
                        .id(course.getId())
                        .title(course.getTitle())
                        .description(course.getDescription())
                        .status(course.getStatus().name())
                        .createdAt(course.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public PagedResponse<CourseResponse> getAllPublishedCourses(Long userId, int page, int size) {
        // Get all published courses
        List<Course> allCourses = courseRepository.findByIsDeletedFalse().stream()
                .filter(course -> course.getStatus() == CourseStatus.PUBLISHED)
                .toList();

        // Calculate pagination
        int totalElements = allCourses.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);

        // Get the current page of courses
        List<Course> pagedCourses = allCourses.subList(
                Math.min(startIndex, totalElements),
                Math.min(endIndex, totalElements));

        // Map to response DTOs
        List<CourseResponse> courseResponses = pagedCourses.stream()
                .map(course -> {
                    String enrollmentStatus = null;
                    Long targetClassId = null;

                    if (userId != null) {
                        Optional<ClassMember> activeMember = classMemberRepository
                                .findActiveEnrollment(userId, course.getId(), LearnerStatus.ACTIVE);

                        if (activeMember.isPresent()) {
                            enrollmentStatus = "ENROLLED";
                            targetClassId = activeMember.get().getCourseClass().getId();
                        }
                    }

                    return CourseResponse.builder()
                            .id(course.getId())
                            .title(course.getTitle())
                            .description(course.getDescription())
                            .status(course.getStatus().name())
                            .createdAt(course.getCreatedAt())
                            .creatorFullName(course.getCreator().getFullName())
                            .creatorAvatarUrl(course.getCreator().getAvatarUrl())
                            .creatorEmail(course.getCreator().getEmail())
                            .enrollmentStatus(enrollmentStatus)
                            .targetClassId(targetClassId)
                            .build();
                })
                .collect(Collectors.toList());

        // Build paged response
        return PagedResponse.<CourseResponse>builder()
                .content(courseResponses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalElements(totalElements)
                .pageSize(size)
                .hasNext(page < totalPages - 1)
                .hasPrevious(page > 0)
                .build();
    }

    public List<CourseResponse> getPendingCourses() {
        List<Course> courses = courseRepository.findByStatusAndIsDeletedFalse(CourseStatus.PENDING);

        return courses.stream()
                .map(course -> CourseResponse.builder()
                        .id(course.getId())
                        .title(course.getTitle())
                        .description(course.getDescription())
                        .status(course.getStatus().name())
                        .createdAt(course.getCreatedAt())
                        .creatorFullName(course.getCreator().getFullName())
                        .creatorAvatarUrl(course.getCreator().getAvatarUrl())
                        .creatorEmail(course.getCreator().getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    public CourseResponse approveCourse(Long courseId, Long adminId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        course.setStatus(CourseStatus.PUBLISHED);
        courseRepository.save(course);

        CourseRequest courseLog = CourseRequest.builder()
                .course(course)
                .adminId(adminId)
                .status(RequestStatus.APPROVED)
                .createdAt(LocalDateTime.now())
                .processedAt(LocalDateTime.now())
                .reason(null)
                .build();

        courseRequestRepository.save(courseLog);

        notificationService.sendToUser(course.getCreator(),
                "Khóa học '" + course.getTitle() + "' của bạn đã được phê duyệt và xuất bản!",
                NotificationType.SYSTEM,
                course.getId());

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .status(course.getStatus().name())
                .createdAt(course.getCreatedAt())
                .approvedBy(admin.getId())
                .reason(null)
                .build();
    }

    public CourseResponse rejectCourse(Long courseId, Long adminId, AdminRejectCourseRequest request) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        course.setStatus(CourseStatus.REJECTED);
        courseRepository.save(course);

        CourseRequest courseLog = CourseRequest.builder()
                .course(course)
                .adminId(adminId)
                .status(RequestStatus.REJECTED)
                .createdAt(LocalDateTime.now())
                .processedAt(LocalDateTime.now())
                .reason(request.getReason())
                .build();

        courseRequestRepository.save(courseLog);

        notificationService.sendToUser(course.getCreator(),
                "Khóa học '" + course.getTitle() + "' của bạn đã bị từ chối.",
                NotificationType.SYSTEM,
                course.getId());

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .status(course.getStatus().name())
                .reason(request.getReason())
                .createdAt(course.getCreatedAt())
                .approvedBy(admin.getId())
                .build();
    }

    public Long createCourse(CreateCourseRequest request, Long creatorId) {

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .creator(creator)
                .status(CourseStatus.valueOf(request.getStatus()))
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        courseRepository.save(course);

        if (request.getModules() == null) {
            return course.getId();
        }

        for (CreateModuleRequest moduleRequest : request.getModules()) {

            CourseModule module = CourseModule.builder()
                    .course(course)
                    .title(moduleRequest.getTitle())
                    .priority(moduleRequest.getPriority())
                    .days(moduleRequest.getDays())
                    .baseExp(moduleRequest.getBaseExp())
                    .speedBonusExp(moduleRequest.getSpeedBonusExp())
                    .sortOrder(moduleRequest.getSortOrder())
                    .build();

            moduleRepository.save(module);

            // Lessons
            if (moduleRequest.getLessons() != null) {

                for (CreateLessonRequest lessonRequest : moduleRequest.getLessons()) {

                    Lesson lesson = Lesson.builder()
                            .module(module)
                            .title(lessonRequest.getTitle())
                            .contentType(lessonRequest.getContentType())
                            .contentUrl(lessonRequest.getContentUrl())
                            .sortOrder(lessonRequest.getSortOrder())
                            .build();

                    lessonRepository.save(lesson);
                }
            }

            // Assignments
            if (moduleRequest.getAssignment() != null) {
                CreateAssignmentRequest assignmentRequest = moduleRequest.getAssignment();
                Assignment assignment = Assignment.builder()
                        .module(module)
                        .title(assignmentRequest.getTitle())
                        .description(assignmentRequest.getDescription())
                        .rubricCriteria(assignmentRequest.getRubricCriteria())
                        .build();
                assignmentRepository.save(assignment);
            }
        }

        if (course.getStatus() == CourseStatus.PENDING) {
            notificationService.sendToRole(Role.ADMIN,
                    "Yêu cầu phê duyệt khóa học mới cho '" + course.getTitle() + "'",
                    NotificationType.COURSE_APPROVAL,
                    course.getId());
        }

        notificationService.sendToUser(course.getCreator(),
                "Khóa học '" + course.getTitle() + "' của bạn đã được tạo và đang chờ phê duyệt.",
                NotificationType.SYSTEM,
                course.getId());

        return course.getId();
    }

    public CourseResponse getPublishedCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        if (course.isDeleted() || course.getStatus() != CourseStatus.PUBLISHED) {
            throw new RuntimeException("Course has been deleted or is not published");
        }

        // Fetch modules
        List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrder(courseId);

        List<ModuleResponse> moduleResponses = modules.stream()
                .map(module -> {
                    // Fetch lessons for this module
                    List<Lesson> lessons = lessonRepository
                            .findByModuleIdOrderBySortOrder(module.getId());
                    List<LessonResponse> lessonResponses = lessons.stream()
                            .map(lesson -> LessonResponse.builder()
                                    .id(lesson.getId())
                                    .title(lesson.getTitle())
                                    .contentType(lesson.getContentType().name())
                                    .contentUrl(lesson.getContentUrl())
                                    .sortOrder(lesson.getSortOrder())
                                    .build())
                            .toList();

                    // Fetch assignment for this module
                    Assignment assignment = assignmentRepository.findByModuleId(module.getId())
                            .orElse(null);
                    AssignmentResponse assignmentResponse = null;
                    if (assignment != null) {
                        assignmentResponse = AssignmentResponse.builder()
                                .id(assignment.getId())
                                .title(assignment.getTitle())
                                .description(assignment.getDescription())
                                .rubricCriteria(assignment.getRubricCriteria())
                                .build();
                    }

                    return ModuleResponse.builder()
                            .id(module.getId())
                            .title(module.getTitle())
                            .priority(module.getPriority().name())
                            .days(module.getDays())
                            .baseExp(module.getBaseExp())
                            .speedBonusExp(module.getSpeedBonusExp())
                            .sortOrder(module.getSortOrder())
                            .lessons(lessonResponses)
                            .assignment(assignmentResponse)
                            .build();
                })
                .toList();

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .status(course.getStatus().name())
                .createdAt(course.getCreatedAt())
                .creatorFullName(course.getCreator().getFullName())
                .creatorAvatarUrl(course.getCreator().getAvatarUrl())
                .creatorEmail(course.getCreator().getEmail())
                .modules(moduleResponses)
                .build();
    }

    public CourseResponse getCourseById(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        if (course.isDeleted()) {
            throw new RuntimeException("Course has been deleted");
        }

        // Fetch modules
        List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrder(courseId);

        List<ModuleResponse> moduleResponses = modules.stream()
                .map(module -> {
                    // Fetch lessons for this module
                    List<Lesson> lessons = lessonRepository
                            .findByModuleIdOrderBySortOrder(module.getId());
                    List<LessonResponse> lessonResponses = lessons.stream()
                            .map(lesson -> LessonResponse.builder()
                                    .id(lesson.getId())
                                    .title(lesson.getTitle())
                                    .contentType(lesson.getContentType().name())
                                    .contentUrl(lesson.getContentUrl())
                                    .sortOrder(lesson.getSortOrder())
                                    .build())
                            .toList();

                    // Fetch assignment for this module
                    Assignment assignment = assignmentRepository.findByModuleId(module.getId())
                            .orElse(null);
                    AssignmentResponse assignmentResponse = null;
                    if (assignment != null) {
                        assignmentResponse = AssignmentResponse.builder()
                                .id(assignment.getId())
                                .title(assignment.getTitle())
                                .description(assignment.getDescription())
                                .rubricCriteria(assignment.getRubricCriteria())
                                .build();
                    }

                    return ModuleResponse.builder()
                            .id(module.getId())
                            .title(module.getTitle())
                            .priority(module.getPriority().name())
                            .days(module.getDays())
                            .baseExp(module.getBaseExp())
                            .speedBonusExp(module.getSpeedBonusExp())
                            .sortOrder(module.getSortOrder())
                            .lessons(lessonResponses)
                            .assignment(assignmentResponse)
                            .build();
                })
                .toList();

        String enrollmentStatus = null;
        Long targetClassId = null;
        boolean isCompleted = false;

        if (userId != null) {
            isCompleted = certificateRepository.existsByUserIdAndCourseId(userId, courseId);
            if (isCompleted) {
                // Find any classId they participated in
                Optional<ClassMember> member = classMemberRepository.findByUserId(userId).stream()
                        .filter(cm -> cm.getCourseClass() != null && cm.getCourseClass().getCourse() != null && cm.getCourseClass().getCourse().getId().equals(courseId))
                        .findFirst();
                if (member.isPresent()) {
                    targetClassId = member.get().getCourseClass().getId();
                }
            } else {
                Optional<ClassMember> activeMember = classMemberRepository
                        .findActiveMember(userId, courseId, LearnerStatus.ACTIVE);

                if (activeMember.isPresent()) {
                    enrollmentStatus = "ENROLLED";
                    targetClassId = activeMember.get().getCourseClass().getId();
                }
            }
        }

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .status(course.getStatus().name())
                .createdAt(course.getCreatedAt())
                .creatorFullName(course.getCreator().getFullName())
                .creatorAvatarUrl(course.getCreator().getAvatarUrl())
                .creatorEmail(course.getCreator().getEmail())
                .modules(moduleResponses)
                .enrollmentStatus(enrollmentStatus)
                .targetClassId(targetClassId)
                .isCompleted(isCompleted)
                .build();
    }

    public LessonResponse getLessonById(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        Long courseId = lesson.getModule().getCourse().getId();

        boolean isEnrolled = classMemberRepository.existsEnrollment(
                userId, courseId,
                List.of(LearnerStatus.ACTIVE, LearnerStatus.NEED_REVIEW));

        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }

        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .contentType(lesson.getContentType().name())
                .contentUrl(lesson.getContentUrl())
                .sortOrder(lesson.getSortOrder())
                .build();
    }

    public AssignmentResponse getAssignmentById(Long assignmentId, Long userId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));

        Long courseId = assignment.getModule().getCourse().getId();

        boolean isEnrolled = classMemberRepository.existsEnrollment(
                userId, courseId,
                List.of(LearnerStatus.ACTIVE, LearnerStatus.NEED_REVIEW));

        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }

        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .rubricCriteria(assignment.getRubricCriteria())
                .build();
    }

    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setDeleted(true);
        courseRepository.save(course);
    }

    @Transactional
    public boolean updateCourse(Long courseId, UpdateCourseRequest request, Long creatorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        validateCourseAccess(course, creatorId);

        boolean statusChangedToPending = request.getStatus() != null &&
                request.getStatus().equalsIgnoreCase("PENDING") &&
                course.getStatus() != CourseStatus.PENDING;

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            course.setDescription(request.getDescription());
        }
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            course.setStatus(CourseStatus.valueOf(request.getStatus().toUpperCase()));
        }
        courseRepository.save(course);

        if (statusChangedToPending) {
            notificationService.sendToRole(Role.ADMIN,
                    "Yêu cầu phê duyệt khóa học mới cho '" + course.getTitle() + "'",
                    NotificationType.COURSE_APPROVAL,
                    course.getId());
        }

        if (request.getModules() != null) {
            processModules(course, request.getModules());
        }

        return true;
    }

    private void validateCourseAccess(Course course, Long creatorId) {
        if (!course.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only course creator can update this course");
        }

        if (course.getStatus() != CourseStatus.DRAFT &&
                course.getStatus() != CourseStatus.REJECTED &&
                course.getStatus() != CourseStatus.ARCHIVED) {
            throw new RuntimeException("Can only update courses in DRAFT, REJECTED, or ARCHIVED status");
        }
    }

    private void processModules(Course course, List<UpdateModuleRequest> moduleRequests) {
        Set<Long> incomingModuleIds = moduleRequests.stream()
                .map(UpdateModuleRequest::getId)
                .collect(Collectors.toSet());

        List<CourseModule> currentModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

        List<CourseModule> modulesToDelete = currentModules.stream()
                .filter(m -> !incomingModuleIds.contains(m.getId()))
                .collect(Collectors.toList());

        if (!modulesToDelete.isEmpty()) {
            moduleRepository.deleteAllInBatch(modulesToDelete);
        }

        for (UpdateModuleRequest moduleRequest : moduleRequests) {
            CourseModule module;

            if (moduleRequest.getId() != null) {
                module = currentModules.stream()
                        .filter(m -> m.getId().equals(moduleRequest.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Module not found with ID: " + moduleRequest.getId()));
            } else {
                module = new CourseModule();
                module.setCourse(course);
            }

            if (moduleRequest.getTitle() != null)
                module.setTitle(moduleRequest.getTitle());
            if (moduleRequest.getPriority() != null)
                module.setPriority(moduleRequest.getPriority());
            if (moduleRequest.getDays() != null)
                module.setDays(moduleRequest.getDays());
            if (moduleRequest.getBaseExp() != null)
                module.setBaseExp(moduleRequest.getBaseExp());
            if (moduleRequest.getSpeedBonusExp() != null)
                module.setSpeedBonusExp(moduleRequest.getSpeedBonusExp());
            if (moduleRequest.getSortOrder() != null)
                module.setSortOrder(moduleRequest.getSortOrder());

            CourseModule savedModule = moduleRepository.save(module);

            if (moduleRequest.getLessons() != null) {
                processLessons(savedModule, moduleRequest.getLessons());
            }
            if (moduleRequest.getAssignment() != null) {
                processAssignment(savedModule, moduleRequest.getAssignment());
            }
        }
    }

    private void processLessons(CourseModule module, List<UpdateLessonRequest> lessonRequests) {
        Set<Long> incomingLessonIds = lessonRequests.stream()
                .map(UpdateLessonRequest::getId)
                .collect(Collectors.toSet());

        List<Lesson> currentLessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());

        List<Lesson> lessonsToDelete = currentLessons.stream()
                .filter(l -> !incomingLessonIds.contains(l.getId()))
                .collect(Collectors.toList());

        if (!lessonsToDelete.isEmpty()) {
            lessonRepository.deleteAllInBatch(lessonsToDelete);
        }

        for (UpdateLessonRequest lessonRequest : lessonRequests) {
            Lesson lesson;
            if (lessonRequest.getId() != null) {
                lesson = currentLessons.stream()
                        .filter(l -> l.getId().equals(lessonRequest.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + lessonRequest.getId()));
            } else {
                lesson = new Lesson();
                lesson.setModule(module);
            }

            if (lessonRequest.getTitle() != null)
                lesson.setTitle(lessonRequest.getTitle());
            if (lessonRequest.getContentType() != null)
                lesson.setContentType(lessonRequest.getContentType());
            if (lessonRequest.getContentUrl() != null)
                lesson.setContentUrl(lessonRequest.getContentUrl());
            if (lessonRequest.getSortOrder() != null)
                lesson.setSortOrder(lessonRequest.getSortOrder());

            lessonRepository.save(lesson);
        }
    }

    private void processAssignment(CourseModule module, UpdateAssignmentRequest assignmentRequest) {
        Assignment assignment;
        if (assignmentRequest.getId() != null) {
            assignment = assignmentRepository.findById(assignmentRequest.getId())
                    .orElseThrow(
                            () -> new RuntimeException("Assignment not found with ID: " + assignmentRequest.getId()));
        } else {
            assignment = new Assignment();
            assignment.setModule(module);
        }

        if (assignmentRequest.getTitle() != null)
            assignment.setTitle(assignmentRequest.getTitle());
        if (assignmentRequest.getDescription() != null)
            assignment.setDescription(assignmentRequest.getDescription());
        if (assignmentRequest.getRubricCriteria() != null)
            assignment.setRubricCriteria(assignmentRequest.getRubricCriteria());

        assignmentRepository.save(assignment);
    }

}
