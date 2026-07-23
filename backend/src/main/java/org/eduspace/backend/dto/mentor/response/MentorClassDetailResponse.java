package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.ClassStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorClassDetailResponse {
    private Long id;
    private String name;
    private LocalDateTime activatedAt;
    private ClassStatus status;
    private Long courseId;
    private String courseTitle;
    private String courseDescription;
    private List<MentorResponse> mentors;
    private long numberOfPairs;
    private List<MentorModuleResponse> modules;
    private org.eduspace.backend.enums.LearnerStatus membershipStatus;
}
