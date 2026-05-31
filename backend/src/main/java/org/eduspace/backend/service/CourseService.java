package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.enums.CourseStatus;
import org.eduspace.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<CourseResponse> getCoursesByCreatorId(Long creatorId){
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
    List<Course> courses =
            courseRepository.findByStatusAndIsDeletedFalse(CourseStatus.PENDING);

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
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

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
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

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

}
