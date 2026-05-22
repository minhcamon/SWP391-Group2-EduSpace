package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.request.CheckEmailRequest;
import org.eduspace.backend.dto.request.CheckUsernameRequest;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.request.OtpRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.request.VerifyOtpRequest;
import org.eduspace.backend.dto.response.AuthResponse;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.service.AuthService;
import org.eduspace.backend.service.EmailService;
import org.eduspace.backend.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Các API xác thực tài khoản (Đăng ký, Đăng nhập, Gửi/Xác thực OTP)")
public class AuthController {
        
    private final AuthService authService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;   
    @Operation(summary = "Đăng nhập tài khoản local", description = "Đăng nhập bằng username hoặc email và mật khẩu.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công, trả về JWT Token và thông tin cơ bản của User"),
            @ApiResponse(responseCode = "401", description = "Sai tài khoản hoặc mật khẩu")
    })
    @PostMapping(path = "/login")
    public ResponseEntity<APIResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

                return ResponseEntity.ok(
                                APIResponse.success("Successfull Login", response));
        }

    
        @Operation(summary = "Kiểm tra username có sẵn", description = "Kiểm tra xem username đã được sử dụng hay chưa.")
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Username khả dụng"),
                @ApiResponse(responseCode = "400", description = "Username không hợp lệ hoặc đã được sử dụng")
        })
        @PostMapping(path = "/check-username")
        public ResponseEntity<APIResponse<?>> checkUsername(
                @Valid @RequestBody CheckUsernameRequest request) {
                try {
                        boolean exists = userRepository.existsByUsername(request.getUsername());
                        
                        if (exists) {
                        return ResponseEntity.badRequest().body(
                                APIResponse.error(400, "This username is already in use", null));
                        }
                        
                        return ResponseEntity.ok(
                                APIResponse.success("Username is available", null));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                APIResponse.error(400, "Error checking username: " + e.getMessage(), null));
                }
        }

        @Operation(summary = "Kiểm tra email có sẵn", description = "Kiểm tra xem email đã được sử dụng hay chưa.")
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Email khả dụng"),
                @ApiResponse(responseCode = "400", description = "Email không hợp lệ hoặc đã được sử dụng")
        })
        @PostMapping(path = "/check-email")
        public ResponseEntity<APIResponse<?>> checkEmail(
                @Valid @RequestBody CheckEmailRequest request) {
                try {
                        boolean exists = userRepository.existsByEmail(request.getEmail());
                        
                        if (exists) {
                        return ResponseEntity.badRequest().body(
                                APIResponse.error(400, "This email is already in use", null));
                        }
                                                
                        return ResponseEntity.ok(
                                APIResponse.success("Email is available", null));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                APIResponse.error(400, "Error checking email: " + e.getMessage(), null));
                }
        }
               
}
