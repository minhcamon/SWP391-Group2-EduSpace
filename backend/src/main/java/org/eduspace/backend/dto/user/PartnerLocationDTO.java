package org.eduspace.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerLocationDTO {
    private Long moduleId;
    private Long lessonId;
    private String lessonName;
}
