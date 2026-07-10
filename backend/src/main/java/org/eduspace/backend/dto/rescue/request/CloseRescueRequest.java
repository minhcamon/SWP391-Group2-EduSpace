package org.eduspace.backend.dto.rescue.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CloseRescueRequest {
    @NotNull(message = "Kết quả cứu trợ (isSuccess) không được để trống")
    private Boolean isSuccess;

    @NotBlank(message = "Ghi chú đóng ca cứu trợ không được để trống")
    private String note;
}
