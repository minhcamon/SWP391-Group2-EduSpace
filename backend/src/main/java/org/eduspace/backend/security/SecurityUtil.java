package org.eduspace.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtil {
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        // Kiểm tra xem Principal có đúng là JWT không
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            // Vì json có thể parse về Integer
            Object userIdObj = jwt.getClaim("userId");
            if (userIdObj instanceof Number number) {
                return number.longValue();
            }
            throw new RuntimeException("userId claim is missing or invalid in JWT");
        }

        throw new RuntimeException("Authentication principal is not a JWT");
    }
}
