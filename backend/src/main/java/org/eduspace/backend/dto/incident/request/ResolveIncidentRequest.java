package org.eduspace.backend.dto.incident.request;

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
}
