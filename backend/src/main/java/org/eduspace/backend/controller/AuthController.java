package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.request.OtpRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.request.VerifyOtpRequest;
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
@Tag(name = "Auth", description = "Các API xác thực tài khoản (Đăng ký, Đăng nhập, Gửi/Xác thực OTP)")
public class AuthController {
        private final AuthService authService;
        private final OtpService otpService;
        private final EmailService emailService;

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
                                APIResponse.success("OTP code is sent to your email and is valid for 5 minutes.",
                                                null));
        }

        @Operation(summary = "Xác thực mã OTP đăng kí tài khoản", description = "Xác thực mã OTP người dùng nhập vào để thực hiện kích hoạt tài khoản.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Xác thực mã OTP thành công"),
                        @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ, hết hạn hoặc quá số lần thử sai tối đa")
        })
        @PostMapping("/verify-register")
        public ResponseEntity<APIResponse<Object>> verifyRegister(
                        @RequestBody VerifyOtpRequest request) {
                boolean isValid = authService.verifyAndActivateUser(request);
                if (isValid) {
                        return ResponseEntity.ok(
                                        APIResponse.success("OTP verification is successful.", null));
                } else {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, "OTP verification failed.", null));
                }
        }

        @Operation(summary = "Xác thực mã OTP quên mật khẩu", description = "Xác thực mã OTP người dùng nhập vào để thực hiện reset mật khẩu.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Xác thực mã OTP thành công"),
                        @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ, hết hạn hoặc quá số lần thử sai tối đa")
        })
        @PostMapping("/verify-forgot")
        public ResponseEntity<APIResponse<Object>> verifyForgot(
                        @RequestBody VerifyOtpRequest request) {
                boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtp());
                if (isValid) {
                        return ResponseEntity.ok(
                                        APIResponse.success("OTP verification is successful.", null));
                } else {
                        return ResponseEntity.badRequest().body(
                                        APIResponse.error(400, "OTP verification failed.", null));
                }
        }
}
