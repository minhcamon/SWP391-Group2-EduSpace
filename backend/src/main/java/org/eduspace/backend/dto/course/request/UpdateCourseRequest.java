package org.eduspace.backend.dto.course.request;


import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCourseRequest {
    private String title;
    private String description;
    private List<UpdateModuleRequest> modules;
}
