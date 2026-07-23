package org.eduspace.backend.dto.waitlist.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.dto.user.response.UserResponse;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WaitlistEntryResponse {
    private Long id;
    private LocalDateTime enrolledAt;
    private UserResponse user;
}
