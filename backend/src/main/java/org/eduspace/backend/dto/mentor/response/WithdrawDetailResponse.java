package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.WithdrawStatus;
import org.eduspace.backend.enums.WithdrawScenario;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawDetailResponse {
    private Long id;
    private Long classId;
    private String className;
    private MentorResponse mentor;
    private String reason;
    private LocalDate expectedLeaveDate;
    private WithdrawStatus status;
    private WithdrawScenario scenario;
    private MentorResponse newMentor;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
