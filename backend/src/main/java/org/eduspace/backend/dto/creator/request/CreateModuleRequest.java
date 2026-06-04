package org.eduspace.backend.dto.creator.request;

import java.util.List;

import org.eduspace.backend.enums.ModulePriority;

import lombok.Data;

@Data
public class CreateModuleRequest {

    private String title;

    private ModulePriority priority;

    private Integer days;

    private Integer baseExp;

    private Integer speedBonusExp;

    private Integer sortOrder;

    private List<CreateLessonRequest> lessons;

    private CreateAssignmentRequest assignments;

}
