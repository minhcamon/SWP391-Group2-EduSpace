package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassDetailResponse {
    private Long classId;
    private String cohortName;
    private Long courseId;
    private String courseTitle;
    private String status;
    private int totalStudents;
}
