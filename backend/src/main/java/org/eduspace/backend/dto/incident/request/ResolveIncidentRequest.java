package org.eduspace.backend.dto.incident.request;

import java.util.List;
import org.eduspace.backend.dto.course.RubricCriteriaDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolveIncidentRequest {
    @NotBlank(message = "Resolution note is required")
    private String resolutionNote;

    private List<RubricCriteriaDto> criteriaScores;
}
