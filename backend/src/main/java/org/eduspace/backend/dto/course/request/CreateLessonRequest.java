package org.eduspace.backend.dto.course.request;

import org.eduspace.backend.enums.LessonContentType;
import lombok.Data;

@Data
public class CreateLessonRequest {

    private String title;

    private LessonContentType contentType;

    private String contentUrl;

    private Integer sortOrder;
}
