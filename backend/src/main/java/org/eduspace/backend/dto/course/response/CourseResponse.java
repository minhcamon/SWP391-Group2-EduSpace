package org.eduspace.backend.dto.course.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private String creatorFullName;
    private String creatorAvatarUrl;
    private String creatorEmail;
    private Long approvedBy;
    private String reason;
    private List<ModuleResponse> modules;
    private String enrollmentStatus;
    private Long targetClassId;
}
