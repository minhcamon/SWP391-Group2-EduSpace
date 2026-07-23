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
public class MentorPairDetailResponse {
    private Long id;
    private String pairName;
    private String className;
    private String status;
    private Double progress;
    private PairMemberResponse student1;
    private PairMemberResponse student2;
    private List<PairMemberResponse> members;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PairMemberResponse {
        private Long userId;
        private String name;
        private String avatarUrl;
        private String email;
        private Double progress;
    }
}
