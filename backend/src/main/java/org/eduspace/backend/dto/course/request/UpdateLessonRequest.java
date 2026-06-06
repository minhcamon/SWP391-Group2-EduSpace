package org.eduspace.backend.dto.course.request;

import org.eduspace.backend.enums.LessonContentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLessonRequest {
    private Long id;
    private String title;
    private LessonContentType contentType;
    private String contentUrl;
    private Integer sortOrder;
}