package org.eduspace.backend.dto.course;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RubricCriteriaDto {
    private String criterionName;
    private String description;
    private Integer maxPoint;
    private Integer score;  
}
