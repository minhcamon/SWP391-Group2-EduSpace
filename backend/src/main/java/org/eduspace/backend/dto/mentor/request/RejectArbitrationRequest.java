package org.eduspace.backend.dto.mentor.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RejectArbitrationRequest {
    @NotBlank(message = "Lý do từ chối không được để trống")
    private String reason;
}
