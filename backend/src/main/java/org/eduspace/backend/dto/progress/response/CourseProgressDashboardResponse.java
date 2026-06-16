package org.eduspace.backend.dto.progress.response;

import java.util.List;
import org.eduspace.backend.dto.user.response.PartnerResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDashboardResponse {
    private PartnerResponse partner;
    private List<ModuleProgressResponse> modules;
}
