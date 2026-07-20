package org.eduspace.backend.dto.progress.response;

import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    @JsonProperty("isLocked")
    private boolean isLocked;
    private Long submissionId;
}
