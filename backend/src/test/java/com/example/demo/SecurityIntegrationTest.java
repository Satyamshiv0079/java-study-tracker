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

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

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
    @DisplayName("Protected endpoint /api/progress/me should return 401 Unauthorized when unauthenticated")
    void protectedProgressMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/progress/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected endpoint /api/dsa/me should return 401 Unauthorized when unauthenticated")
    void protectedDsaMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/dsa/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected endpoint /api/analytics/me should return 401 Unauthorized when unauthenticated")
    void protectedAnalyticsMeShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/analytics/me"))
                .andExpect(status().isUnauthorized());
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
    @DisplayName("ADMIN-only endpoint POST /api/knowledge should return 403 Forbidden for normal ROLE_USER")
    void adminEndpointShouldRejectNormalUser() throws Exception {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");

        mockMvc.perform(post("/api/knowledge")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Java Memory\",\"category\":\"JVM\",\"content\":\"Heap and Stack\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ADMIN-only endpoint POST /api/knowledge should succeed for ROLE_ADMIN")
    void adminEndpointShouldSucceedForAdmin() throws Exception {
        String adminToken = jwtUtil.generateToken(999L, "admin", "ROLE_ADMIN");

        mockMvc.perform(post("/api/knowledge")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"System Architecture\",\"category\":\"Architecture\",\"content\":\"Microservices and Event Driven\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("User Isolation: User B cannot see progress completed by User A")
    void userIsolationProgressTest() throws Exception {
        com.example.demo.model.User userA = userRepository.save(com.example.demo.model.User.builder()
                .username("isolatedUserA")
                .email("userA@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        com.example.demo.model.User userB = userRepository.save(com.example.demo.model.User.builder()
                .username("isolatedUserB")
                .email("userB@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String userAToken = jwtUtil.generateToken(userA.getId(), userA.getUsername(), userA.getRole());
        String userBToken = jwtUtil.generateToken(userB.getId(), userB.getUsername(), userB.getRole());

        // User A toggles day 7
        mockMvc.perform(post("/api/progress/me/7")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk());

        // User B fetches their progress - day 7 should NOT be present or completed for User B
        mockMvc.perform(get("/api/progress/me")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().string(
                    org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("\"dayNumber\":7"))
                ));
    }
}
