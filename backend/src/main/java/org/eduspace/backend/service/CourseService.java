package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.request.CreateAssignmentRequest;
import org.eduspace.backend.dto.request.CreateCourseRequest;
import org.eduspace.backend.dto.request.CreateLessonRequest;
import org.eduspace.backend.dto.request.CreateModuleRequest;
import org.eduspace.backend.dto.response.CourseResponse;
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

        public CourseResponse approveCourse(Long courseId) {

                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                course.setStatus(CourseStatus.PUBLISHED);

                courseRepository.save(course);

                return CourseResponse.builder()
                                .id(course.getId())
                                .title(course.getTitle())
                                .description(course.getDescription())
                                .status(course.getStatus().name())
                                .createdAt(course.getCreatedAt())
                                .build();
        }

        public CourseResponse rejectCourse(Long courseId) {

                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                course.setStatus(CourseStatus.DRAFT);

                courseRepository.save(course);

                return CourseResponse.builder()
                                .id(course.getId())
                                .title(course.getTitle())
                                .description(course.getDescription())
                                .status(course.getStatus().name())
                                .createdAt(course.getCreatedAt())
                                .build();
        }

        public Long createCourse(CreateCourseRequest request, Long creatorId) {

                User creator = userRepository.findById(creatorId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Course course = Course.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .creator(creator)
                                .status(CourseStatus.DRAFT)
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

                                for (CreateAssignmentRequest assignmentRequest : moduleRequest.getAssignments()) {

                                        Assignment assignment = Assignment.builder()
                                                        .module(module)
                                                        .title(assignmentRequest.getTitle())
                                                        .description(assignmentRequest.getDescription())
                                                        .rubricCriteria(assignmentRequest.getRubricCriteria())
                                                        .build();

                                        assignmentRepository.save(assignment);
                                }
                        }
                }

                return course.getId();
        }
}
