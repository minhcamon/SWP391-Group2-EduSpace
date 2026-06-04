package org.eduspace.backend.dto.admin.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminRejectCourseRequest {

    @NotNull(message = "Admin ID cannot be null")
    private Long adminId; 
    @NotBlank(message = "Rejection reason cannot be blank")
    private String reason;
}
