package org.eduspace.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorDashboardResponse {
    private long inProgressIncidents;
    private long resolvedIncidents;
    private long assignedClasses;
    private long assignedCourses;
}
