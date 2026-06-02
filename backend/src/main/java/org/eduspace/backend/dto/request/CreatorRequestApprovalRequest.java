package org.eduspace.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatorRequestApprovalRequest {
    private Long requestId;
    private Long learnerId;
    private String learnerEmail;
    private String learnerName;
    private String documentUrl;
    private String status;
}
