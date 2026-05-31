package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.dto.response.UserResponse;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.service.AuthService;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/user")
@Tag(name = "User", description = "Các API quản lý và lấy thông tin người dùng")
public class UserController {
    private final AuthService authService;

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
                APIResponse.success("Successfull Get Profile", userResponse));
    }

}
