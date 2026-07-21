package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.MentorStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActiveMentorResponse {
    private Long courseId;
    private String courseTitle;
    private boolean isRegistered; // true if registered in ActiveMentor pool
    private MentorStatus status; // AVAILABLE, BUSY, INACTIVE (null if isRegistered is false)
}
