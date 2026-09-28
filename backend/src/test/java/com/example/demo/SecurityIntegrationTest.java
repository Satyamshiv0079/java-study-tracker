package com.example.demo;

import com.example.demo.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource(properties = {
    "JWT_SECRET=superSecretKeyForMockMvcSecurityIntegrationTesting2026AtLeast32Bytes!"
})
class SecurityIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private JwtUtil jwtUtil;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("Public endpoint /api/health should be accessible without authentication")
    void publicHealthCheckShouldSucceed() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Protected endpoint /api/progress/me should return 401 or 403 when unauthenticated")
    void protectedProgressMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/progress/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Protected endpoint /api/dsa/me should return 401 or 403 when unauthenticated")
    void protectedDsaMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/dsa/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Protected endpoint /api/analytics/me should return 401 or 403 when unauthenticated")
    void protectedAnalyticsMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/analytics/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Protected endpoint /api/progress/me should succeed when valid JWT Bearer token is provided")
    void protectedProgressMeShouldSucceedWithValidJwt() throws Exception {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");

        mockMvc.perform(get("/api/progress/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ADMIN-only endpoint POST /api/knowledge should return 403 for normal ROLE_USER")
    void adminEndpointShouldRejectNormalUser() throws Exception {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");

        mockMvc.perform(post("/api/knowledge")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Java Memory\",\"category\":\"JVM\",\"content\":\"Heap and Stack\"}"))
                .andExpect(status().isForbidden());
    }
}
