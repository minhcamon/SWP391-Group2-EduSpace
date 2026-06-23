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
    private boolean isCompleted;
    private boolean isLocked;
    private boolean completedByPartner;
    private boolean isPartnerCurrent;
    private Integer sortOrder;
}
