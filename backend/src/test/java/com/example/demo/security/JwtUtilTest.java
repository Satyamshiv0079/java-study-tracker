package com.example.demo.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private static final String TEST_SECRET = "codeMentorTestSecretKeyThatIsAtLeast32BytesLongForHmacSha256Testing!";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(TEST_SECRET);
    }

    @Test
    @DisplayName("Should generate a valid JWT token with user claims")
    void shouldGenerateValidToken() {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("satyam", jwtUtil.extractUsername(token));
        assertEquals(1L, jwtUtil.extractUserId(token));
        assertEquals("ROLE_USER", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Should reject tampered or invalid token")
    void shouldRejectTamperedToken() {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");
        String tamperedToken = token + "xyz";

        assertFalse(jwtUtil.validateToken(tamperedToken));
    }

    @Test
    @DisplayName("Should fallback safely if secret is missing or too short without throwing")
    void shouldFallbackIfSecretTooShort() {
        JwtUtil fallback1 = new JwtUtil("short");
        assertNotNull(fallback1);
        String token1 = fallback1.generateToken(1L, "satyam", "ROLE_USER");
        assertTrue(fallback1.validateToken(token1));

        JwtUtil fallback2 = new JwtUtil("");
        assertNotNull(fallback2);
        assertTrue(fallback2.validateToken(token1));

        JwtUtil fallback3 = new JwtUtil(null);
        assertNotNull(fallback3);
        assertTrue(fallback3.validateToken(token1));
    }
}
