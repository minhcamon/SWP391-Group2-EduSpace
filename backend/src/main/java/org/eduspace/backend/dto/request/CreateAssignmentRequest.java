package org.eduspace.backend.dto.request;

import java.util.List;

import org.eduspace.backend.dto.RubricCriteriaDto;

import lombok.Data;

@Data
public class CreateAssignmentRequest {

    private String title;

    private String description;

    private List<RubricCriteriaDto> rubricCriteria;
}