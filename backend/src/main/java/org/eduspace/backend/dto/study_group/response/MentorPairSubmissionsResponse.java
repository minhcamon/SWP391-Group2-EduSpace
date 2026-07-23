package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.SubmissionStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorPairSubmissionsResponse {

    private Long pairId;
    private String pairName;
    private String courseName;
    private String className;

    private List<SubmissionItem> submissions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionItem {
        private Long submissionId;
        private Long submitterId;
        private String submitterName;
        private String submitterAvatarUrl;

        private Long assignmentId;
        private String assignmentTitle;
        private Long moduleId;
        private String moduleTitle;

        private String submissionContent;
        private SubmissionStatus status;
        private LocalDateTime submittedAt;
    }
}
