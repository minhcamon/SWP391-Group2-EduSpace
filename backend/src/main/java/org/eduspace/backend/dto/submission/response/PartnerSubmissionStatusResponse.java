package org.eduspace.backend.dto.submission.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerSubmissionStatusResponse {
    private Long partnerId;
    private String partnerName;
    private String partnerAvatarUrl;
    private boolean submitted;
    private LocalDateTime submittedAt;
}
