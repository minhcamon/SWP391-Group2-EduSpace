package org.eduspace.backend.dto.submission.response;

import java.time.LocalDateTime;
import java.util.List;

import org.eduspace.backend.dto.course.RubricCriteriaDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionReviewResponse {
    private Long reviewId;
    private Long submissionId;
    private String assignmentTitle;
    private String assignmentDescription;
    private String submissionContent;
    private String status;
    private LocalDateTime submittedAt;
    private List<RubricCriteriaDto> rubricCriterias;
    private String comments;
}
