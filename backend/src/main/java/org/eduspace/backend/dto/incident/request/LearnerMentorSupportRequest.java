package org.eduspace.backend.dto.incident.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.eduspace.backend.enums.IncidentType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LearnerMentorSupportRequest {

    @NotNull(message = "Request type cannot be null")
    private IncidentType incidentType;

    private Long courseId;

    private Long studyGroupId;

    private Long reportedUserId;

    @NotBlank(message = "Reason cannot be blank")
    @Size(max = 2000, message = "Reason is too long")
    private String reason;

    @Size(max = 2000, message = "Evidence URL is too long")
    private String evidenceUrl;
}
