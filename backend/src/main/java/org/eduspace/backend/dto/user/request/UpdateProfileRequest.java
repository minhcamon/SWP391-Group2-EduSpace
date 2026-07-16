package org.eduspace.backend.dto.user.request;

import jakarta.validation.constraints.Email;
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
public class UpdateProfileRequest {

    @NotBlank(message = "Không được để trống tên")
    @Size(min = 3, max = 100, message = "Họ tên phải có từ 3 đến 100 ký tự")
    private String fullName;

    @NotBlank(message = "Không được để trống email")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^(\\d{10,})?$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Size(max = 2000, message = "Bio không được vượt quá 2000 ký tự")
    private String bio;

    private String avatarUrl;
}
