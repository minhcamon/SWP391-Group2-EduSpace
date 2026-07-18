package org.eduspace.backend.service;

import org.eduspace.backend.dto.auth.request.ForgotPasswordRequest;
import org.eduspace.backend.dto.auth.request.RegisterRequest;
import org.eduspace.backend.dto.auth.request.ResetPasswordRequest;
import org.eduspace.backend.dto.auth.request.VerifyOtpRequest;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.UserStatus;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String JWT_SECRET = "01234567890123456789012345678901";
    private static final String EMAIL = "learner@example.com";

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(JWT_SECRET);
        authService = new AuthService(userRepository, emailService, passwordEncoder, jwtUtil);
    }

    @Test
    void register_savesPendingUserAndSendsVerificationEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("System Test User")
                .username("systemuser")
                .email(EMAIL)
                .password("Test@1234")
                .phone("0123456789")
                .build();

        when(passwordEncoder.encode("Test@1234")).thenReturn("encoded-password");

        authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(userRepository).save(userCaptor.capture());
        verify(emailService).sendVerificationEmail(eq(EMAIL), tokenCaptor.capture());

        User savedUser = userCaptor.getValue();
        String verificationToken = tokenCaptor.getValue();

        assertEquals(UserStatus.PENDING, savedUser.getStatus());
        assertEquals("encoded-password", savedUser.getPassword());
        assertEquals(verificationToken, savedUser.getVerificationToken());
        assertTrue(jwtUtil.isEmailVerificationToken(verificationToken));
        assertEquals(EMAIL, jwtUtil.extractEmail(verificationToken));
        assertNotNull(savedUser.getVerificationTokenExpiry());
    }

    @Test
    void verifyEmail_activatesPendingUserAndClearsToken() {
        String token = jwtUtil.generateEmailVerificationToken(EMAIL);
        User user = User.builder()
                .email(EMAIL)
                .status(UserStatus.PENDING)
                .verificationToken(token)
                .verificationTokenExpiry(LocalDateTime.now().plusMinutes(1))
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        authService.verifyEmail(token);

        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertEquals(null, user.getVerificationToken());
        assertEquals(null, user.getVerificationTokenExpiry());
        verify(userRepository).save(user);
    }

    @Test
    void verifyEmail_rejectsTokenThatDoesNotMatchStoredToken() {
        String validToken = jwtUtil.generateEmailVerificationToken(EMAIL);
        User user = User.builder()
                .email(EMAIL)
                .status(UserStatus.PENDING)
                .verificationToken(jwtUtil.generateEmailVerificationToken("other@example.com"))
                .verificationTokenExpiry(LocalDateTime.now().plusMinutes(1))
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.verifyEmail(validToken));

        assertEquals("Invalid verification token", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void resendVerificationEmail_updatesPendingUserTokenAndSendsEmail() {
        User user = User.builder()
                .email(EMAIL)
                .status(UserStatus.PENDING)
                .verificationToken("old-token")
                .verificationTokenExpiry(LocalDateTime.now().minusMinutes(1))
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        authService.resendVerificationEmail(EMAIL);

        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(userRepository).save(user);
        verify(emailService).sendVerificationEmail(eq(EMAIL), tokenCaptor.capture());

        String newToken = tokenCaptor.getValue();
        assertFalse("old-token".equals(newToken));
        assertEquals(newToken, user.getVerificationToken());
        assertTrue(jwtUtil.isEmailVerificationToken(newToken));
        assertEquals(EMAIL, jwtUtil.extractEmail(newToken));
        assertTrue(user.getVerificationTokenExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    void resendVerificationEmail_rejectsAlreadyActiveUser() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder()
                .email(EMAIL)
                .status(UserStatus.ACTIVE)
                .build()));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.resendVerificationEmail(EMAIL));

        assertFalse(exception.getMessage().isBlank());
        verify(emailService, never()).sendVerificationEmail(any(), any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void forgotPassword_sendsSixDigitOtpForExistingEmail() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder().email(EMAIL).build()));

        authService.forgotPassword(ForgotPasswordRequest.builder().email(EMAIL).build());

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(eq(EMAIL), otpCaptor.capture());

        assertTrue(otpCaptor.getValue().matches("\\d{6}"));
    }

    @Test
    void forgotPassword_rejectsUnknownEmail() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> authService.forgotPassword(ForgotPasswordRequest.builder().email(EMAIL).build()));

        verify(emailService, never()).sendOtpEmail(any(), any());
    }

    @Test
    void verifyOtp_returnsResetTokenAndConsumesOtp() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder().email(EMAIL).build()));

        authService.forgotPassword(ForgotPasswordRequest.builder().email(EMAIL).build());

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(eq(EMAIL), otpCaptor.capture());

        String resetToken = authService.verifyOtp(VerifyOtpRequest.builder()
                .email(EMAIL)
                .otp(otpCaptor.getValue())
                .build());

        assertTrue(jwtUtil.isResetPasswordToken(resetToken));
        assertEquals(EMAIL, jwtUtil.extractEmail(resetToken));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.verifyOtp(VerifyOtpRequest.builder()
                        .email(EMAIL)
                        .otp(otpCaptor.getValue())
                        .build()));

        assertTrue(exception.getMessage().contains("OTP"));
    }

    @Test
    void verifyOtp_rejectsIncorrectOtp() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder().email(EMAIL).build()));

        authService.forgotPassword(ForgotPasswordRequest.builder().email(EMAIL).build());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.verifyOtp(VerifyOtpRequest.builder()
                        .email(EMAIL)
                        .otp("000000")
                        .build()));

        assertTrue(exception.getMessage().contains("OTP"));
    }

    @Test
    void resetPassword_encodesAndStoresNewPassword() {
        String resetToken = jwtUtil.generateResetPasswordToken(EMAIL);
        User user = User.builder().email(EMAIL).password("old-password").build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("New@1234")).thenReturn("encoded-new-password");

        authService.resetPassword(ResetPasswordRequest.builder()
                .resetToken(resetToken)
                .password("New@1234")
                .build());

        assertEquals("encoded-new-password", user.getPassword());
        verify(userRepository).save(user);
    }
}
