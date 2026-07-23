package org.eduspace.backend.dto.rescue.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.RescueStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueListResponse {
    private Long id;
    private Long incidentId;
    private Long learnerClassMemberId;
    private String learnerName;
    private String reason;
    private LocalDateTime rescueStartedAt;
    private LocalDateTime rescueDeadline;
    private RescueStatus status;
}
