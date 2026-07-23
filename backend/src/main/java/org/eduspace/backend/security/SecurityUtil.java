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

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            Object userIdObj = jwt.getClaim("userId");
            if (userIdObj instanceof Number number) {
                return number.longValue();
            } else if (userIdObj instanceof String str) {
                return Long.parseLong(str);
            }
            throw new RuntimeException("userId claim is missing or invalid in JWT");
        }

        throw new RuntimeException("Authentication principal is not a JWT");
    }

    public static Long getCurrentUserIdAndAllowNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return null;
        }

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            Object userIdObj = jwt.getClaim("userId");
            if (userIdObj instanceof Number number) {
                return number.longValue();
            } else if (userIdObj instanceof String str) {
                try {
                    return Long.parseLong(str);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }

        return null;
    }
}
