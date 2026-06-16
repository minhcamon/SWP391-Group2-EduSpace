package org.eduspace.backend.dto.user.response;

import org.eduspace.backend.dto.user.PartnerLocationDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerResponse {
    private Long partnerId;
    private String name;
    private String avatarUrl;
    private String description;
    private PartnerLocationDTO location;
}
