package org.eduspace.backend.dto.assignment.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDTO {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long memberId;
    private String learnerName;
    private String submissionUrl;
    private LocalDateTime submittedAt;
    private String status;
}