package org.eduspace.backend.dto.incident.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.dto.course.RubricCriteriaDto;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDetailResponse {
    private Long id;
    private IncidentType incidentType;
    private String reporterName;
    private String reportedName;
    private String reason;
    private String evidenceUrl;
    private IncidentStatus status;
    private String resolvedByName;
    private String resolutionNote;
    private LocalDateTime createdAt;
    private LocalDateTime solvedAt;

    private String submissionTitle;
    private String submissionContent;
    private Integer scoreGiven;
    private String reviewerComment;
    private List<RubricCriteriaDto> rubricCriteria;
}
