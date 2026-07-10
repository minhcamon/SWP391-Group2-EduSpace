package org.eduspace.backend.dto.mentor.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandoverRequestDto {

    @NotNull(message = "Mã Mentor mới không được để trống")
    private Long newMentorId;
}
