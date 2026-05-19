package org.eduspace.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.request.OtpRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.request.VerifyOtpRequest;
import org.eduspace.backend.dto.response.ApiResponse;
import org.eduspace.backend.dto.response.AuthResponse;
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
public class AuthController {
    private final AuthService authService;
    private OtpService otpService;
    private EmailService emailService;

    @PostMapping(path = "/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success("Successfull Login", response));
    }

    @PostMapping(path = "/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.success("Successfull Register", response));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Object>> sendOtp(@RequestBody OtpRequest request) {
        String email = request.getEmail();
        try {
            String otp = otpService.generateOTP(email);
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(
                    ApiResponse.success("Mã OTP đã được gửi đến email của bạn và có hiệu lực trong 5 phút.", null));
        } catch (RuntimeException e) {
            // Bắt lỗi khi người dùng gửi yêu cầu quá nhanh (Spam Cooldown)
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(400, e.getMessage(), null));

        } catch (Exception e) {
            // Bắt các lỗi hệ thống khác (vd: sai cấu hình mail, đứt mạng...)
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(500, "Lỗi khi gửi email: " + e.getMessage(), null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtp());
        if (isValid) {
            return ResponseEntity.ok(
                    ApiResponse.success("Xác thực OTP thành công.", null));
        } else {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(400, "Mã OTP không chính xác hoặc đã hết hạn.", null));
        }
    }

}
