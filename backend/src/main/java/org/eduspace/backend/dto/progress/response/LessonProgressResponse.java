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
public class LessonProgressResponse {
    private Long id;
    private String title;
    private String contentType;
    private String contentUrl;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    @JsonProperty("isLocked")
    private boolean isLocked;
    @JsonProperty("completedByPartner")
    private boolean completedByPartner;
    @JsonProperty("isPartnerCurrent")
    private boolean isPartnerCurrent;
    private Integer sortOrder;
}
