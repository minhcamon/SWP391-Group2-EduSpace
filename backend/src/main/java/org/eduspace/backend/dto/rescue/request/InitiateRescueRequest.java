package org.eduspace.backend.dto.rescue.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitiateRescueRequest {
    @NotNull(message = "Learner ClassMember ID is required")
    private Long learnerClassMemberId;

    @NotBlank(message = "Reason for rescue is required")
    private String reason;
}
