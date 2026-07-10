package org.eduspace.backend.dto.incident.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LearnerMentorSupportRequest {

    @NotNull(message = "Course ID cannot be null")
    private Long courseId;

    @NotBlank(message = "Reason cannot be blank")
    @Size(max = 2000, message = "Reason is too long")
    private String reason;

    @Size(max = 2000, message = "Evidence URL is too long")
    private String evidenceUrl;
}
