package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.response.AuthResponse;
import org.eduspace.backend.dto.response.UserResponse;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.AuthProvider;
import org.eduspace.backend.enums.UserStatus;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.security.JwtUtil;
import org.eduspace.backend.security.SecurityUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() != null && userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("This username is already in use");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("This email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new BadCredentialsException("Invalid username or password.")));

        if(user.getPassword().isBlank()){
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        // CHECK STATUS
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account disabled");
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
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();

        return userResponse;
    }
}
