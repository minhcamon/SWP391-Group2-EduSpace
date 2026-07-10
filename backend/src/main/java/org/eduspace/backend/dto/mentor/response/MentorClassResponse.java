package org.eduspace.backend.dto.mentor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.ClassStatus;

import java.time.LocalDateTime;

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
}
