package org.eduspace.backend.dto.progress.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {
    private Long id;
    private String title;
    private Boolean isCompleted;
    private Boolean isLocked;
    private Boolean completedByPartner;
    private Boolean isPartnerCurrent;
    private Integer sortOrder;
}
