package org.eduspace.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentListResponse {
    private Long id;
    private IncidentType incidentType;
    private String reporterName;
    private String reason;
    private IncidentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime solvedAt;
}
