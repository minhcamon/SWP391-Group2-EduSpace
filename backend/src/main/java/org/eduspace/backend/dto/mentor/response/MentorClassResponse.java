package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.enums.ClassStatus;
import org.eduspace.backend.enums.LearnerStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorClassResponse {
    private Long id;
    private String name;
    private LocalDateTime activatedAt;
    private ClassStatus status;
    private Long courseId;
    private String courseTitle;
    private long numberOfPairs;
    private long numberOfLearners;
    private List<StudyGroupResponse> studyGroups;
    private LearnerStatus membershipStatus;
}
