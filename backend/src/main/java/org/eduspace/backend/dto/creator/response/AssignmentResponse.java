package org.eduspace.backend.dto.creator.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.eduspace.backend.dto.common.RubricCriteriaDto;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentResponse {
    private Long id;
    private String title;
    private String description;
    private List<RubricCriteriaDto> rubricCriteria;
}
