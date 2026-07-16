package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.user.request.UpdateProfileRequest;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.service.AuthService;
import org.eduspace.backend.service.CloudinaryService;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.enums.UserStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/user")
@Tag(name = "User", description = "Các API quản lý và lấy thông tin người dùng")
public class UserController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Operation(summary = "Lấy thông tin cá nhân (Profile)", description = "Lấy thông tin chi tiết của người dùng hiện tại từ JWT token đã xác thực.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy profile thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Tài khoản bị cấm hoặc không có quyền truy cập")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/profile")
    public ResponseEntity<APIResponse<UserResponse>> getProfile() {
        UserResponse userResponse = authService.getUserProfile();
        return ResponseEntity.ok(
                APIResponse.success("Lấy thông tin profile thành công", userResponse));
    }

    @Operation(summary = "Cập nhật thông tin cá nhân (Profile)", description = "Cập nhật thông tin người dùng hiện tại. Chỉ cập nhật các trường được gửi lên.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật profile thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "409", description = "Email đã được sử dụng bởi tài khoản khác")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/profile")
    public ResponseEntity<APIResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse userResponse = authService.updateProfile(request);
        return ResponseEntity.ok(
                APIResponse.success("Cập nhật profile thành công", userResponse));
    }

    @Operation(
        summary = "Upload và cập nhật avatar", 
        description = "Upload ảnh avatar lên Cloudinary và tự động cập nhật vào profile của user đang đăng nhập. Ảnh sẽ được tự động resize về 400x400px."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload avatar thành công và đã cập nhật profile"),
            @ApiResponse(responseCode = "400", description = "File rỗng, không hợp lệ hoặc không phải là ảnh"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<UserResponse>> uploadAvatar(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "File không được để trống", null));
        }

        // Validate file type (chỉ chấp nhận ảnh)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "File phải là ảnh (jpg, png, gif, ...)", null));
        }

        // Validate file size (tối đa 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "Kích thước file không được vượt quá 5MB", null));
        }

        // Upload ảnh lên Cloudinary
        String avatarUrl = cloudinaryService.uploadAvatar(file);

        // Tự động cập nhật avatar vào profile user
        UserResponse updatedUser = authService.updateAvatar(avatarUrl);

        return ResponseEntity.ok(
                APIResponse.success("Upload avatar thành công", updatedUser));
    }

    @Operation(summary = "Lấy tổng số người dùng đang hoạt động (Dành cho Admin)", description = "Lấy tổng số lượng người dùng có trạng thái ACTIVE.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count/active")
    public ResponseEntity<APIResponse<Long>> getActiveUsersCount() {
        long count = userRepository.countByStatus(UserStatus.ACTIVE);
        return ResponseEntity.ok(APIResponse.success("Successfully retrieved active users count", count));
    }
}
