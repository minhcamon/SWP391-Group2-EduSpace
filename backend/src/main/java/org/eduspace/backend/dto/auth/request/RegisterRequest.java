package org.eduspace.backend.dto.auth.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Cannot be left fullname blank")
    private String fullName;

    @NotBlank(message = "Cannot be left username blank")
    @Size(min = 4, max = 30, message = "Username at least 4-30 characters")
    @Pattern(regexp = "^[^@\\s]+$", message = "User does not include '@' character")
    private String username;

    @NotBlank(message = "Cannot be left email blank")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Cannot be left password blank")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$", message = "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.")
    private String password;

    @Pattern(regexp = "^(\\d{10,})?$", message = "The phone must contain at least 10 numbers")
    private String phone;

}
