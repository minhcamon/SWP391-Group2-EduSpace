package org.eduspace.backend.dto.progress.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentProgressResponse {
    private Long id;
    private String title;
    private String status;
    private boolean isCompleted;
}
