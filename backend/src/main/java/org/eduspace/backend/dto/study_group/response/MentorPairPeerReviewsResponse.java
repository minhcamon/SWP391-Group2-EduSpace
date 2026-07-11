package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.course.RubricCriteriaDto;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorPairPeerReviewsResponse {

    private Long pairId;
    private String pairName;
    private String courseName;
    private String className;

    private List<PeerReviewItem> peerReviews;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeerReviewItem {
        private Long peerReviewId;

        private Long submissionId;
        private Long submitterUserId;
        private String submitterName;
        private String submitterAvatarUrl;

        private Long reviewerUserId;
        private String reviewerName;
        private String reviewerAvatarUrl;

        private Long assignmentId;
        private String assignmentTitle;
        private Long moduleId;
        private String moduleTitle;

        private List<RubricCriteriaDto> criteriaScores;
        private Integer finalScore;
        private String comments;
        private boolean isOverridden;
        private LocalDateTime reviewAt;
    }
}
