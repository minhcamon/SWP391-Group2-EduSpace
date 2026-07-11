package org.eduspace.backend.dto.mentor.response;

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
public class MentorArbitrationResponse {
    private Long id;
    private IncidentType incidentType;
    
    private Long reporterUserId;
    private String reporterName;
    
    private Long reportedUserId;
    private String reportedName;
    
    private String reason;
    private String evidenceUrl;
    private IncidentStatus status;
    
    private Long classId;
    private String className;
    private String courseTitle;
    
    private Long submissionId;
    private String submissionTitle;
    
    private String resolvedByName;
    private String resolutionNote;
    
    private LocalDateTime createdAt;
    private LocalDateTime solvedAt;
}
