package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.eduspace.backend.dto.auth.request.LoginRequest;
import org.eduspace.backend.dto.auth.request.RegisterRequest;
import org.eduspace.backend.dto.auth.request.ResetPasswordRequest;
import org.eduspace.backend.dto.auth.response.AuthResponse;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.UserStatus;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.security.JwtUtil;
import org.eduspace.backend.security.SecurityUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() != null && userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("This username is already in use");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("This email is already in use");
        }

        // Generate verification token (valid for 1 minute)
        String verificationToken = jwtUtil.generateEmailVerificationToken(request.getEmail());

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .status(UserStatus.PENDING)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusMinutes(1))
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(request.getEmail(), verificationToken);

        return AuthResponse.builder()
                .build();
    }

    public void verifyEmail(String token) {
        if (!jwtUtil.isEmailVerificationToken(token)) {
            throw new RuntimeException("Invalid verification token");
        }

        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Verification token has expired");
        }

        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            return;
        }

        if (!token.equals(user.getVerificationToken())) {
            throw new RuntimeException("Invalid verification token");
        }

        if (user.getVerificationTokenExpiry() != null
                && LocalDateTime.now().isAfter(user.getVerificationTokenExpiry())) {
            throw new RuntimeException("Verification token has expired");
        }

        // Activate the account
        user.setStatus(UserStatus.ACTIVE);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        // Validate email format
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email không được để trống");
        }
        
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new RuntimeException("Email không hợp lệ");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản đã được xác thực. Bạn có thể đăng nhập ngay.");
        }

        if (user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException("Tài khoản không ở trạng thái chờ xác thực");
        }

        // Generate new verification token
        String newVerificationToken = jwtUtil.generateEmailVerificationToken(email);

        user.setVerificationToken(newVerificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(1));
        userRepository.save(user);

        // Send new verification email
        emailService.sendVerificationEmail(email, newVerificationToken);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new BadCredentialsException("Invalid username or password.")));

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        // Check if account is verified
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account not verified. Please check your email to verify your account.");
        }

        String token = jwtUtil.generateToken(user);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }

    public UserResponse getUserProfile() {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found or not authenticated"));

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();

        return userResponse;
    }

    public void resetPassword(ResetPasswordRequest request) {

        String token = request.getResetToken();

        if (!jwtUtil.isResetPasswordToken(token)) {
            throw new RuntimeException("Invalid reset token");
        }

        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        userRepository.save(user);
    }
}
