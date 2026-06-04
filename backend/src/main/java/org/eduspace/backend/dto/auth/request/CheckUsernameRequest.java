package org.eduspace.backend.dto.auth.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckUsernameRequest {
    @NotBlank(message = "Cannot be left username blank")
    @Size(min = 4, max = 30, message = "At least 4-30 characters")
    @Pattern(regexp = "^[^@\\s]+$", message = "User does not include '@' character")
    private String username;
}
