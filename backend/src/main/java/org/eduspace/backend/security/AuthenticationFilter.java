package org.eduspace.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.UserStatus;
import org.eduspace.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;

    // 1. Loại bỏ các API Public khỏi Filter này
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/course/all")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            Object userIdObj = jwt.getClaim("userId");
            Long userId = null;
            if (userIdObj instanceof Number number) {
                userId = number.longValue();
            } else if (userIdObj instanceof String str) {
                userId = Long.parseLong(str);
            }

            if (userId != null) {
                User user = userRepository.findById(userId).orElse(null);

                if (user != null && user.getStatus() != UserStatus.ACTIVE) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter()
                            .write("{\"code\": 403, \"message\": \"Your account has been banned or disabled!\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
