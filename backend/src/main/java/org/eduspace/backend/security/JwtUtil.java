package org.eduspace.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.eduspace.backend.entity.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private final String key = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(key.getBytes());
    private long EXPIRATION_TIME= 3600000;

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();

            extraClaims.put("name", user.getFullName());
            extraClaims.put("email", user.getEmail());
            extraClaims.put("role", user.getRole().name());
            if (user.getAvatarUrl() != null) {
                extraClaims.put("avatar", user.getAvatarUrl());
            }
            extraClaims.put("useId", user.getId());

            return generateToken(extraClaims,user);
        }


    public String generateToken(Map<String,Object> extraClaims, User user) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }
}
