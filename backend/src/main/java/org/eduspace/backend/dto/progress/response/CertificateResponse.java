package org.eduspace.backend.dto.progress.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    @JsonProperty("isAlreadyMentor")
    private boolean isAlreadyMentor;
    private String userName;
    private String courseTitle;
    private String certificateId;
    private LocalDateTime issuedAt;
    private String author;
}
