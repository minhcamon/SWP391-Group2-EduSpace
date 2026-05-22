package org.eduspace.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.eduspace.backend.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private String secret;

    private final SecretKey secretKey;

    private long EXPIRATION_TIME = 3600000;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secret = secret;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();

        extraClaims.put("name", user.getFullName());
        extraClaims.put("email", user.getEmail());
        extraClaims.put("role", user.getRole().name());
        if (user.getAvatarUrl() != null) {
            extraClaims.put("avatar", user.getAvatarUrl());
        }
        extraClaims.put("userId", user.getId());

        return generateToken(extraClaims, user);
    }

    public String generateToken(Map<String, Object> extraClaims, User user) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }
}
