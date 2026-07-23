package org.eduspace.backend.dto.submission.request;

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
public class PeerReviewGradeRequest {
    private List<RubricCriteriaDto> criteriaScores;
    private Integer finalScore;
    private String comments;
}
