package org.eduspace.backend.dto.learner.request;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAssignmentRequest {
    @NotNull(message = "Assignment ID cannot be null")
    private Long assignmentId;

    @NotBlank(message = "Submission URL cannot be blank")
    @URL(message = "Invalid URL format")
    private String submissionUrl;
}
