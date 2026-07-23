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
public class MentorPairProgressResponse {
    private Long pairId;
    private String pairName;
    private String courseName;
    private String className;
    
    private List<PairMemberProgress> members;
    private List<ModuleProgressDetail> modules;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PairMemberProgress {
        private Long userId;
        private String name;
        private String avatarUrl;
        private double overallProgress;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleProgressDetail {
        private Long moduleId;
        private String moduleTitle;
        private int sortOrder;
        
        private List<MemberModuleProgress> memberProgresses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberModuleProgress {
        private Long userId;
        private double progress;
        private int completedLessons;
        private int totalLessons;
        private boolean assignmentCompleted;
    }
}
