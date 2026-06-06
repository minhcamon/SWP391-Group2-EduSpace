package org.eduspace.backend.dto.course.request;

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
public class UpdateAssignmentRequest {
    private Long id;
    private String title;
    private String description;
    private List<RubricCriteriaDto> rubricCriteria;
}