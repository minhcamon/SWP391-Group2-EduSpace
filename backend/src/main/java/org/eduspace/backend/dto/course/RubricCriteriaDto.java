package org.eduspace.backend.dto.course;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RubricCriteriaDto {
    private String criterionName;
    private String description;
    private Integer maxPoint;
    private Integer score;

    public RubricCriteriaDto(String criterionName, String description, Integer maxPoint) {
        this.criterionName = criterionName;
        this.description = description;
        this.maxPoint = maxPoint;
        this.score = null;
    }
}
