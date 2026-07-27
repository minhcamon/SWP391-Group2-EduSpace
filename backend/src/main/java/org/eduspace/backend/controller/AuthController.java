package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.auth.request.CheckEmailRequest;
import org.eduspace.backend.dto.auth.request.CheckUsernameRequest;
import org.eduspace.backend.dto.auth.request.LoginRequest;
import org.eduspace.backend.dto.auth.request.RegisterRequest;
import org.eduspace.backend.dto.auth.request.ResetPasswordRequest;
import org.eduspace.backend.dto.auth.request.ForgotPasswordRequest;
import org.eduspace.backend.dto.auth.request.VerifyOtpRequest;
import org.eduspace.backend.dto.auth.response.AuthResponse;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Các API xác thực tài khoản (Đăng ký, Đăng nhập, Xác thực Email)")
public class AuthController {

        private final AuthService authService;
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

        @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo mới một tài khoản người dùng với các thông tin cơ bản. Hệ thống sẽ gửi email xác thực đến địa chỉ email đã đăng ký.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Đăng ký thành công, email xác thực đã được gửi"),
                        @ApiResponse(responseCode = "400", description = "Thông tin đăng ký không hợp lệ, email hoặc username đã được sử dụng")
        })
        @PostMapping(path = "/register")
        public ResponseEntity<APIResponse<AuthResponse>> register(
                        @Valid @RequestBody RegisterRequest request) {
                AuthResponse response = authService.register(request);

                return ResponseEntity.ok(
                                APIResponse.success(
                                                "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
                                                response));
        }

        @Operation(summary = "Xác thực email", description = "Xác thực tài khoản người dùng thông qua token được gửi qua email.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Xác thực email thành công, tài khoản đã được kích hoạt"),
                        @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc đã hết hạn")
        })
        @GetMapping("/verify-email")
        public ResponseEntity<APIResponse<Object>> verifyEmail(
                        @RequestParam String token) {
                try {
                        authService.verifyEmail(token);
                        return ResponseEntity.ok(
                                        APIResponse.success(
                                                        "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.",
                                                        null));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, e.getMessage(), null));
                }
        }

        @Operation(summary = "Gửi lại email xác thực", description = "Gửi lại email xác thực cho tài khoản chưa được kích hoạt.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Email xác thực mới đã được gửi"),
                        @ApiResponse(responseCode = "400", description = "Email không hợp lệ hoặc tài khoản đã được kích hoạt")
        })
        @PostMapping("/resend-verification")
        public ResponseEntity<APIResponse<Object>> resendVerificationEmail(
                        @Valid @RequestBody CheckEmailRequest request) {
                try {
                        authService.resendVerificationEmail(request.getEmail());
                        return ResponseEntity.ok(
                                        APIResponse.success(
                                                        "Email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
                                                        null));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, e.getMessage(), null));
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

        @Operation(summary = "Yêu cầu đặt lại mật khẩu (Gửi OTP)", description = "Nhập email để hệ thống gửi mã OTP xác thực qua email.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Gửi mã OTP thành công"),
                        @ApiResponse(responseCode = "400", description = "Email không tồn tại hoặc lỗi trong quá trình xử lý")
        })
        @PostMapping("/forgot-password")
        public ResponseEntity<APIResponse<Object>> forgotPassword(
                        @Valid @RequestBody ForgotPasswordRequest request) {
                try {
                        authService.forgotPassword(request);
                        return ResponseEntity.ok(
                                        APIResponse.success(
                                                        "Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư!",
                                                        null));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, e.getMessage(), null));
                }
        }

        @Operation(summary = "Xác thực mã OTP", description = "Nhập email và OTP nhận được để xác thực. Trả về token đổi mật khẩu nếu hợp lệ.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Xác thực OTP thành công, trả về reset token"),
                        @ApiResponse(responseCode = "400", description = "Mã OTP không chính xác hoặc đã hết hạn")
        })
        @PostMapping("/verify-otp")
        public ResponseEntity<APIResponse<String>> verifyOtp(
                        @Valid @RequestBody VerifyOtpRequest request) {
                try {
                        String resetToken = authService.verifyOtp(request);
                        return ResponseEntity.ok(
                                        APIResponse.success(
                                                        "Xác thực mã OTP thành công!",
                                                        resetToken));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, e.getMessage(), null));
                }
        }

}
