package org.eduspace.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.RubricCriteriaDto;
import java.util.List;

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
