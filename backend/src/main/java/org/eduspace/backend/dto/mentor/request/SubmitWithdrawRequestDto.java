package org.eduspace.backend.dto.mentor.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitWithdrawRequestDto {

    @NotBlank(message = "Lý do rút lui không được để trống")
    private String reason;

    private LocalDate expectedLeaveDate;
}
