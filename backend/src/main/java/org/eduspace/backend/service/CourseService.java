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
import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.CourseRequest;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.CourseStatus;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.LessonContentType;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.RequestStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.exception.BadRequestException;
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
                .map(course -> {
                    String reason = null;
                    if (course.getStatus() == CourseStatus.REJECTED) {
                        List<CourseRequest> rejectedRequests = courseRequestRepository
                                .findByCourseIdAndStatusOrderByCreatedAtDesc(course.getId(), RequestStatus.REJECTED);
                        if (!rejectedRequests.isEmpty()) {
                            reason = rejectedRequests.get(0).getReason();
                        }
                    }
                    return CourseResponse.builder()
                            .id(course.getId())
                            .title(course.getTitle())
                            .description(course.getDescription())
                            .status(course.getStatus().name())
                            .createdAt(course.getCreatedAt())
                            .reason(reason)
                            .build();
                })
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

        if (course.getStatus() != CourseStatus.PENDING) {
            throw new RuntimeException("Only pending courses can be approved");
        }

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

        if (course.getStatus() != CourseStatus.PENDING) {
            throw new RuntimeException("Only pending courses can be rejected");
        }

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

        validateCreateCourseContent(request);

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .creator(creator)
                .status(CourseStatus.valueOf(request.getStatus().toUpperCase()))
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        courseRepository.save(course);

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
                        .filter(cm -> cm.getCourseClass() != null && cm.getCourseClass().getCourse() != null
                                && cm.getCourseClass().getCourse().getId().equals(courseId))
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

    public void deleteCourse(Long courseId, Long currentUserId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = course.getCreator().getId().equals(currentUserId);
        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Only course creator or admin can delete this course");
        }

        course.setDeleted(true);
        courseRepository.save(course);
    }

    @Transactional
    public boolean updateCourse(Long courseId, UpdateCourseRequest request, Long creatorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        validateCourseAccess(course, creatorId);
        validateUpdateCourseContent(request);

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

    private void validateCreateCourseContent(CreateCourseRequest request) {
        if (isBlank(request.getTitle())) {
            throw new BadRequestException("Tên khóa học không được để trống.");
        }

        if (isBlank(request.getDescription())) {
            throw new BadRequestException("Mô tả khóa học không được để trống.");
        }

        validateCourseStatus(request.getStatus());
        if (request.getModules() == null || request.getModules().isEmpty()) {
            throw new BadRequestException("Khóa học phải có ít nhất một module.");
        }

        for (int i = 0; i < request.getModules().size(); i++) {
            validateCreateModule(request.getModules().get(i), i + 1);
        }
    }

    private void validateUpdateCourseContent(UpdateCourseRequest request) {
        if (request.getTitle() != null && isBlank(request.getTitle())) {
            throw new BadRequestException("Tên khóa học không được để trống.");
        }

        if (request.getDescription() != null && isBlank(request.getDescription())) {
            throw new BadRequestException("Mô tả khóa học không được để trống.");
        }

        if (request.getStatus() != null) {
            validateCourseStatus(request.getStatus());
        }
        if (request.getModules() != null && request.getModules().isEmpty()) {
            throw new BadRequestException("Khóa học phải có ít nhất một module.");
        }

        if (request.getModules() == null) {
            return;
        }

        for (int i = 0; i < request.getModules().size(); i++) {
            validateUpdateModule(request.getModules().get(i), i + 1);
        }
    }

    private void validateCourseStatus(String status) {
        if (isBlank(status)) {
            throw new BadRequestException("Trạng thái khóa học không được để trống.");
        }

        try {
            CourseStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái khóa học không hợp lệ.");
        }
    }

    private void validateCreateModule(CreateModuleRequest moduleRequest, int moduleIndex) {
        String moduleLabel = formatModuleLabel(moduleRequest != null ? moduleRequest.getTitle() : null, moduleIndex);

        if (moduleRequest == null) {
            throw new BadRequestException("Module " + moduleIndex + " không hợp lệ.");
        }

        validateModuleFields(moduleRequest.getTitle(), moduleRequest.getPriority(), moduleRequest.getDays(),
                moduleRequest.getBaseExp(), moduleRequest.getSpeedBonusExp(), moduleLabel);
        validateCreateLessons(moduleRequest.getLessons(), moduleLabel);
        validateCreateAssignment(moduleRequest.getAssignment(), moduleLabel);
    }

    private void validateUpdateModule(UpdateModuleRequest moduleRequest, int moduleIndex) {
        String moduleLabel = formatModuleLabel(moduleRequest != null ? moduleRequest.getTitle() : null, moduleIndex);

        if (moduleRequest == null) {
            throw new BadRequestException("Module " + moduleIndex + " không hợp lệ.");
        }

        validateModuleFields(moduleRequest.getTitle(), moduleRequest.getPriority(), moduleRequest.getDays(),
                moduleRequest.getBaseExp(), moduleRequest.getSpeedBonusExp(), moduleLabel);
        validateUpdateLessons(moduleRequest.getLessons(), moduleLabel);
        validateUpdateAssignment(moduleRequest.getAssignment(), moduleLabel);
    }

    private void validateModuleFields(String title, Object priority, Integer days, Integer baseExp,
            Integer speedBonusExp, String moduleLabel) {
        if (isBlank(title)) {
            throw new BadRequestException("Tên " + moduleLabel + " không được để trống.");
        }

        if (priority == null) {
            throw new BadRequestException("Độ khó của " + moduleLabel + " không được để trống.");
        }

        if (days == null || days <= 0) {
            throw new BadRequestException("Thời lượng của " + moduleLabel + " phải lớn hơn 0 ngày.");
        }

        if (baseExp == null || baseExp <= 0) {
            throw new BadRequestException("Base EXP của " + moduleLabel + " phải lớn hơn 0.");
        }

        if (speedBonusExp == null || speedBonusExp < 0) {
            throw new BadRequestException("Bonus EXP của " + moduleLabel + " không được âm.");
        }
    }

    private void validateCreateLessons(List<CreateLessonRequest> lessons, String moduleLabel) {
        if (lessons == null || lessons.isEmpty()) {
            throw new BadRequestException(moduleLabel + " phải có ít nhất một bài học.");
        }

        for (int i = 0; i < lessons.size(); i++) {
            CreateLessonRequest lesson = lessons.get(i);
            validateLessonFields(
                    lesson != null ? lesson.getTitle() : null,
                    lesson != null ? lesson.getContentType() : null,
                    lesson != null ? lesson.getContentUrl() : null,
                    moduleLabel,
                    i + 1);
        }
    }

    private void validateUpdateLessons(List<UpdateLessonRequest> lessons, String moduleLabel) {
        if (lessons == null || lessons.isEmpty()) {
            throw new BadRequestException(moduleLabel + " phải có ít nhất một bài học.");
        }

        for (int i = 0; i < lessons.size(); i++) {
            UpdateLessonRequest lesson = lessons.get(i);
            validateLessonFields(
                    lesson != null ? lesson.getTitle() : null,
                    lesson != null ? lesson.getContentType() : null,
                    lesson != null ? lesson.getContentUrl() : null,
                    moduleLabel,
                    i + 1);
        }
    }

    private void validateLessonFields(String title, LessonContentType contentType, String contentUrl,
            String moduleLabel, int lessonIndex) {
        String lessonLabel = "Bài học " + lessonIndex + " của " + moduleLabel;

        if (isBlank(title)) {
            throw new BadRequestException(lessonLabel + " phải có tiêu đề.");
        }

        if (contentType == null) {
            throw new BadRequestException(lessonLabel + " phải có loại nội dung.");
        }

        if (contentType != LessonContentType.TEXT && isBlank(contentUrl)) {
            throw new BadRequestException(lessonLabel + " phải có URL hoặc tài liệu đính kèm.");
        }
    }

    private void validateCreateAssignment(CreateAssignmentRequest assignmentRequest, String moduleLabel) {
        if (assignmentRequest == null) {
            throw new BadRequestException(moduleLabel + " phải có bài tập cuối module.");
        }

        validateAssignmentFields(assignmentRequest.getTitle(), assignmentRequest.getDescription(),
                assignmentRequest.getRubricCriteria(), moduleLabel);
    }

    private void validateUpdateAssignment(UpdateAssignmentRequest assignmentRequest, String moduleLabel) {
        if (assignmentRequest == null) {
            throw new BadRequestException(moduleLabel + " phải có bài tập cuối module.");
        }

        validateAssignmentFields(assignmentRequest.getTitle(), assignmentRequest.getDescription(),
                assignmentRequest.getRubricCriteria(), moduleLabel);
    }

    private void validateAssignmentFields(String title, String description, List<RubricCriteriaDto> rubricCriteria,
            String moduleLabel) {
        if (isBlank(title)) {
            throw new BadRequestException("Bài tập của " + moduleLabel + " phải có tiêu đề.");
        }

        if (isBlank(description)) {
            throw new BadRequestException("Bài tập của " + moduleLabel + " phải có yêu cầu hoặc mô tả.");
        }

        validateRubricCriteria(moduleLabel, rubricCriteria);
    }

    private String formatModuleLabel(String moduleTitle, int moduleIndex) {
        return isBlank(moduleTitle) ? "module " + moduleIndex : "module '" + moduleTitle.trim() + "'";
    }

    private void validateRubricCriteria(String moduleLabel, List<RubricCriteriaDto> rubricCriteria) {
        if (rubricCriteria == null || rubricCriteria.isEmpty()) {
            throw new BadRequestException("Bài tập của " + moduleLabel
                    + " phải có ít nhất một tiêu chí chấm điểm.");
        }

        boolean hasInvalidCriterion = rubricCriteria.stream()
                .anyMatch(criteria -> criteria == null
                        || isBlank(criteria.getCriterionName())
                        || criteria.getMaxPoint() == null
                        || criteria.getMaxPoint() <= 0);

        if (hasInvalidCriterion) {
            throw new BadRequestException("Tiêu chí chấm điểm của " + moduleLabel
                    + " phải có tên tiêu chí và điểm tối đa lớn hơn 0.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
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
