package org.eduspace.backend.dto.waitlist.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CancelWaitlistRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
}
