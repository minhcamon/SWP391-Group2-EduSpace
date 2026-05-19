package org.eduspace.backend.controller;

import org.eduspace.backend.dto.response.ApiResponse;
import org.eduspace.backend.dto.response.UserResponse;
import org.eduspace.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/user")
public class UserController {
    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        UserResponse userResponse = authService.getUserProfile();
        return ResponseEntity.ok(
                ApiResponse.success("Successfull Get Profile", userResponse));
    }
}
