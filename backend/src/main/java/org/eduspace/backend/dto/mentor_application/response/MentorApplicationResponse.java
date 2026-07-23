package org.eduspace.backend.dto.mentor_application.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorApplicationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long courseId;
    private String courseTitle;
    private String status;
    private LocalDateTime createdAt;
}
