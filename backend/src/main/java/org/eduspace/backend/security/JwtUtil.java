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

    private final SecretKey secretKey;

    private final long EXPIRATION_TIME = 3600000;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
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

    public String generateResetPasswordToken(String email) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("purpose", "RESET_PASSWORD");

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }    
    public boolean isResetPasswordToken(String token) {

        String purpose = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("purpose", String.class);

        return "RESET_PASSWORD".equals(purpose);
    }

}
