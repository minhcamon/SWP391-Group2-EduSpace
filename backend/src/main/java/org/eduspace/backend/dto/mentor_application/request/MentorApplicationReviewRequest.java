package org.eduspace.backend.dto.mentor_application.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorApplicationReviewRequest {
    private String rejectedReason;
}
