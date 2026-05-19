package org.eduspace.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.request.OtpRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.request.VerifyOtpRequest;
import org.eduspace.backend.dto.response.ApiResponse;
import org.eduspace.backend.dto.response.AuthResponse;
import org.eduspace.backend.dto.response.UserResponse;
import org.eduspace.backend.service.AuthService;
import org.eduspace.backend.service.EmailService;
import org.eduspace.backend.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final OtpService otpService;
    private final EmailService emailService;

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

        String otp = otpService.generateOTP(email);
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(
                ApiResponse.success("OTP code is sent to your email and is valid for 5 minutes.", otp));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtp());
        if (isValid) {
            return ResponseEntity.ok(
                    ApiResponse.success("OTP verification is successful.", null));
        } else {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(400, "OTP verification failed.", null));
        }
    }

}
