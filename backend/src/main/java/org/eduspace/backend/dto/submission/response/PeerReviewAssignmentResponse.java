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
public class PeerReviewAssignmentResponse {
    private Long reviewId;
    private Long submissionId;
    private Long submitterId;
    private String submitterName;
    private String submissionContent;
    private String assignmentTitle;
    private String assignmentDescription;
    private LocalDateTime submittedAt;
    private List<RubricCriteriaDto> rubricCriterias;
}
