package org.eduspace.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.LoginRequest;
import org.eduspace.backend.dto.request.RegisterRequest;
import org.eduspace.backend.dto.response.ApiResponse;
import org.eduspace.backend.dto.response.AuthResponse;
import org.eduspace.backend.service.AuthService;
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

    @PostMapping(path = "/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success("Successfull Login",response)
        );
    }

    @PostMapping(path = "/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request){
        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.success("Successfull Register",response)
        );
    }
}
