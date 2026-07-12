package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorModuleResponse {
    private Long id;
    private String title;
    private String status; // "COMPLETED", "ACTIVE", "LOCKED"
    private double completionRate;
    private List<MentorModuleContentResponse> contents;
}
