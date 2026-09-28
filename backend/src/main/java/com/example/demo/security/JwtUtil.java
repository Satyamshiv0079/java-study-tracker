package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final long EXPIRATION_TIME = 86400000L; // 24 hours

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(JwtUtil.class);
    public static final String DEFAULT_DEV_FALLBACK_SECRET =
            "CodeMentor-Production-Ready-Secret-Key-Must-Be-At-Least-32-Bytes-For-HS256!";

    private final SecretKey key;

    public JwtUtil(@Value("${JWT_SECRET:${jwt.secret:}}") String jwtSecret) {
        String effectiveSecret = jwtSecret;
        if (effectiveSecret == null || effectiveSecret.isBlank() || effectiveSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            log.warn("[SECURITY NOTICE] JWT_SECRET environment variable is missing or shorter than 32 bytes. " +
                     "Using default fallback signing key. " +
                     "For production environments (Render, AWS, etc.), set JWT_SECRET in your dashboard.");
            effectiveSecret = DEFAULT_DEV_FALLBACK_SECRET;
        }
        this.key = Keys.hmacShaKeyFor(effectiveSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("role", role != null ? role : "ROLE_USER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        Object idObj = extractAllClaims(token).get("userId");
        if (idObj instanceof Number) {
            return ((Number) idObj).longValue();
        }
        return null;
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
