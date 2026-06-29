package org.eduspace.backend.dto.progress.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.LearnerModuleStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ModuleStatusResponse {
    private Long learnerId;
    private Long moduleId;
    private LearnerModuleStatus status; // ACTIVE, NEED_REVIEW, SUBMITTED
}