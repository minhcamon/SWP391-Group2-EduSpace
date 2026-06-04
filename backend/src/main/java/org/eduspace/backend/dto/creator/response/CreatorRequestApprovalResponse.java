package org.eduspace.backend.dto.creator.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatorRequestApprovalResponse {
    private Long id;
    private String status;
    private Long learnerId;
    private Long approvedBy;
    private LocalDateTime processedAt;
}
