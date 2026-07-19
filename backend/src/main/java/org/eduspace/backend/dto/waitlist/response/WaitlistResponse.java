package org.eduspace.backend.dto.waitlist.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.WaitlistStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WaitlistResponse {
    private Long id;
    private CourseSummaryResponse course;
    private WaitlistStatus status;
    private LocalDateTime createdAt;
    private List<WaitlistEntryResponse> students;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CourseSummaryResponse {
        private Long id;
        private String title;
        private String description;
    }
}
