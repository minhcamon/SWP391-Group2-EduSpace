package org.eduspace.backend.dto.progress.response;

import java.util.List;
import org.eduspace.backend.dto.user.response.PartnerResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleProgressResponse {
    private Long id;
    private String title;
    private double progress;
    private String status;
    private boolean isLocked;
    private int sortOrder;
    private int completedLessons;
    private int totalLessons;
    private List<LessonProgressResponse> lessons;
    private PartnerResponse partner;
    private Long studyGroupId;
}
