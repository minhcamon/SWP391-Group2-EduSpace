package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassLeaderboardResponse {
    private List<IndividualEntry> individual;
    private List<PairEntry> pairs;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IndividualEntry {
        private int rank;
        private Long userId;
        private String name;
        private String avatar;
        private int progress;
        private boolean isSelf;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PairEntry {
        private int rank;
        private Long studyGroupId;
        private String name;
        private List<String> avatars;
        private int progress;
        private boolean isSelf;
    }
}
