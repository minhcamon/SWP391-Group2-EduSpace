package org.eduspace.backend.dto.course.request;

import java.util.List;
import org.eduspace.backend.enums.ModulePriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateModuleRequest {
    private Long id;
    private String title;
    private ModulePriority priority;
    private Integer days;
    private Integer baseExp;
    private Integer speedBonusExp;
    private Integer sortOrder;
    private List<UpdateLessonRequest> lessons;
    private UpdateAssignmentRequest assignment;
}