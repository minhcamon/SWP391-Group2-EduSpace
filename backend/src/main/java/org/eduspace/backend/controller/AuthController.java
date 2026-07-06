package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.eduspace.backend.dto.auth.request.CheckEmailRequest;
import org.eduspace.backend.dto.auth.request.CheckUsernameRequest;
import org.eduspace.backend.dto.auth.request.LoginRequest;
import org.eduspace.backend.dto.auth.request.OtpRequest;
import org.eduspace.backend.dto.auth.request.RegisterRequest;
import org.eduspace.backend.dto.auth.request.ResetPasswordRequest;
import org.eduspace.backend.dto.auth.request.VerifyOtpRequest;
import org.eduspace.backend.dto.auth.response.AuthResponse;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.security.JwtUtil;
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

    private final JwtUtil jwtUtil;
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

    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo mới một tài khoản người dùng với các thông tin cơ bản.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
            @ApiResponse(responseCode = "400", description = "Thông tin đăng ký không hợp lệ, email hoặc username đã được sử dụng")
    })
    @PostMapping(path = "/register")
    public ResponseEntity<APIResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(
                APIResponse.success("Successfull Register", response));
    }

    @Operation(summary = "Gửi mã OTP", description = "Tự động sinh mã OTP ngẫu nhiên gồm 6 chữ số và gửi qua email người dùng (Mã có hiệu lực trong 5 phút).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mã OTP đã được gửi thành công đến email")
    })
    @PostMapping("/send-otp")
    public ResponseEntity<APIResponse<Object>> sendOtp(
            @RequestBody OtpRequest request) {
        String email = request.getEmail();

        String otp = otpService.generateOTP(email);
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(
                APIResponse.success("OTP code is sent to your email and is valid for 5 minutes.", null));
    }

    @Operation(summary = "Xác thực mã OTP", description = "Xác thực mã OTP người dùng nhập vào để thực hiện kích hoạt tài khoản hoặc reset mật khẩu.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xác thực mã OTP thành công"),
            @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ, hết hạn hoặc quá số lần thử sai tối đa")
    })
    @PostMapping("/verify-forgot")
    public ResponseEntity<APIResponse<Object>> verifyOtp(
            @RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtp());
        if (isValid) {
            String resetToken = jwtUtil.generateResetPasswordToken(
                    request.getEmail());

            return ResponseEntity.ok(
                    APIResponse.success(
                            "OTP verification is successful.",
                            Map.of(
                                    "resetToken", resetToken)));
        }

        else {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "OTP verification failed.", null));
        }
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

    @Operation(summary = "Xác nhận reset password", description = "Thay đổi mật khẩu cho forgot password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thay đổi thành công"),
            @ApiResponse(responseCode = "400", description = "Thay đổi không thành công")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<APIResponse<Object>> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                APIResponse.success(
                        "Password reset successfully.",
                        null));
    }

}
