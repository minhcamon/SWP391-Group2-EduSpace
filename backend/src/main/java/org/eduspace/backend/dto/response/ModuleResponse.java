package org.eduspace.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ModuleResponse {
    private Long id;
    private String title;
    private String priority;
    private int days;
    private int baseExp;
    private int speedBonusExp;
    private int sortOrder;
    private List<LessonResponse> lessons;
    private AssignmentResponse assignment;
}
