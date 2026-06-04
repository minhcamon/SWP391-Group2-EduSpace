package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.request.AdminRejectCourseRequest;
import org.eduspace.backend.dto.request.CreateAssignmentRequest;
import org.eduspace.backend.dto.request.CreateCourseRequest;
import org.eduspace.backend.dto.request.CreateLessonRequest;
import org.eduspace.backend.dto.request.CreateModuleRequest;
import org.eduspace.backend.dto.response.AssignmentResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.dto.response.LessonResponse;
import org.eduspace.backend.dto.response.ModuleResponse;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.CourseStatus;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.LessonRepository;
import org.eduspace.backend.repository.ModuleRepository;
import org.eduspace.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
        private final CourseRepository courseRepository;
        private final ModuleRepository moduleRepository;
        private final AssignmentRepository assignmentRepository;
        private final LessonRepository lessonRepository;
        private final UserRepository userRepository;

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

        public List<CourseResponse> getAllPublishedCourses() {
                List<Course> courses = courseRepository.findByIsDeletedFalse().stream()
                                .filter(course -> course.getStatus() == CourseStatus.PUBLISHED)
                                .toList();

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

                course.setApproveBy(admin);
                course.setStatus(CourseStatus.PUBLISHED);
                course.setReason(null);
                
                courseRepository.save(course);

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

        public CourseResponse rejectCourse(Long courseId, AdminRejectCourseRequest request) {

                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));
                User admin = userRepository.findById(request.getAdminId())
                                .orElseThrow(() -> new RuntimeException("Admin user not found"));

                course.setStatus(CourseStatus.REJECTED);
                course.setApproveBy(admin);
                course.setReason(request.getReason());

                courseRepository.save(course);

                return CourseResponse.builder()
                                .id(course.getId())
                                .title(course.getTitle())
                                .description(course.getDescription())
                                .status(course.getStatus().name())
                                .createdAt(course.getCreatedAt())
                                .approvedBy(course.getApproveBy() != null ? course.getApproveBy().getId() : null)
                                .reason(course.getReason())
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
                        if (moduleRequest.getAssignments() != null) {
                                CreateAssignmentRequest assignmentRequest = moduleRequest.getAssignments();
                                Assignment assignment = Assignment.builder()
                                                .module(module)
                                                .title(assignmentRequest.getTitle())
                                                .description(assignmentRequest.getDescription())
                                                .rubricCriteria(assignmentRequest.getRubricCriteria())
                                                .build();
                                assignmentRepository.save(assignment);
                        }
                }

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


        public CourseResponse getCourseById(Long courseId) {
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
}
