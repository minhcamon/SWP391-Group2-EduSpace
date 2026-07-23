package org.eduspace.backend.dto.progress.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDashboardResponse {
    private Long focusModuleId;
    private List<ModuleProgressResponse> modules;
    private Long focusLessonId;
    private Long classId;
}
