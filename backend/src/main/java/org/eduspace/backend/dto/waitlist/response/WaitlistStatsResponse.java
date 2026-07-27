package org.eduspace.backend.dto.waitlist.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.user.response.UserResponse;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WaitlistStatsResponse {
    private Long waitlistId;
    private Long courseId;
    private String courseTitle;
    private Integer currentCount;
    private Integer minRequired;
    private Integer maxCapacity;
    private LocalDateTime createdAt;
    private Integer daysElapsed;
    private Integer autoStartAfterDays;
    private Integer gracePeriodHours;
    private Boolean canStart;
    private Boolean canCancel;
    private String status;
    private List<UserResponse> members;
}
