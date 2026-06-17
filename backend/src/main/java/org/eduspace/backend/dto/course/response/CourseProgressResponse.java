package org.eduspace.backend.dto.course.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseProgressResponse {
    private Long courseId;
    private String courseName;
    private double progressPercentage;
    private Long classId;
    private Long currentLessonId;
    private String currentLessonTitle;
    private String currentModuleTitle;
}
