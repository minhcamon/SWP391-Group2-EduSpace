package org.eduspace.backend.dto.course.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequestHistoryResponse {
    private Long courseRequestId;
    private String courseName;
    private Long creatorId;
    private String creatorName;
    private Long approvedId;
    private String status;
    private LocalDateTime processedAt;
}
