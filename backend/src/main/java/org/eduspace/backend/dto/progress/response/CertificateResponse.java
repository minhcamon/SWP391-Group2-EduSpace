package org.eduspace.backend.dto.progress.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    private Boolean isCompleted;
    private Boolean isAlreadyMentor;
    private Long courseId;
    private String userName;
    private String courseTitle;
    private String certificateId;
    private LocalDateTime issuedAt;
    private String author;
}
