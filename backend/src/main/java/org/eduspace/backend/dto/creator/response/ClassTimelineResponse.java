package org.eduspace.backend.dto.creator.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassTimelineResponse {
    private Long classId;
    private String className;
    private String classStatus;
    private List<ModuleTimelineItem> timeline;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleTimelineItem {
        private Long moduleId;
        private String moduleTitle;
        private Integer sortOrder;
        private LocalDateTime dueDate;
        private boolean isStarted;
        private Integer groupCount;
    }
}
