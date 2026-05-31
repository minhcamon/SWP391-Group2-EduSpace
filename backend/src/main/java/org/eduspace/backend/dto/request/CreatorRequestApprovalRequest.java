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
    private Long learnerId;
    private String learnerName;
    private String documentUrl;
}
