package org.eduspace.backend.dto.creator.request;

import java.util.List;

import lombok.Data;

@Data
public class CreateCourseRequest {

    private String title;

    private String description;

    private List<CreateModuleRequest> modules;

    private String status;
}
