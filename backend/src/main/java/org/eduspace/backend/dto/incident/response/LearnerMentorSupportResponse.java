package org.eduspace.backend.dto.incident.response;

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
public class LearnerMentorSupportResponse {

    private Long incidentId;
    private IncidentType incidentType;
    private IncidentStatus incidentStatus;
    private LocalDateTime rescueDeadline;
}
