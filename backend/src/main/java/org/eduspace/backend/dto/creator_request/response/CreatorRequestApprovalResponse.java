package org.eduspace.backend.dto.creator_request.response;

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
    private Long learnerId;
    private String learnerName;
    private String learnerEmail;
    private Long approvedBy;
    private LocalDateTime processedAt;
    private String status;
    private String reason;
}
