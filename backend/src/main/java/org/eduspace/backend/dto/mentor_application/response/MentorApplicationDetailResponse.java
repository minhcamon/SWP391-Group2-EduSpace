package org.eduspace.backend.dto.mentor_application.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.course.RubricCriteriaDto;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorApplicationDetailResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long courseId;
    private String courseTitle;
    private String status;
    private LocalDateTime createdAt;
    private String rejectedReason;
    private List<SubmissionDetail> submissions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionDetail {
        private String assignmentTitle;
        private String assignmentDescription;
        private String submissionContent;
        private LocalDateTime submittedAt;
        private String status;
        private Integer finalScore;
        private String comments;
        private List<RubricCriteriaDto> criteriaScores;
    }
}
