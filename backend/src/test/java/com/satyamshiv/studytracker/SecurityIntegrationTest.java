package com.satyamshiv.studytracker;

import com.satyamshiv.studytracker.security.JwtUtil;
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
    private com.satyamshiv.studytracker.repository.UserRepository userRepository;

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
    @DisplayName("ADMIN-only endpoint DELETE /api/knowledge/{id} should return 403 Forbidden for normal ROLE_USER")
    void adminDeleteEndpointShouldRejectNormalUser() throws Exception {
        String token = jwtUtil.generateToken(1L, "satyam", "ROLE_USER");

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/knowledge/999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("User Isolation: User B cannot see progress completed by User A")
    void userIsolationProgressTest() throws Exception {
        com.satyamshiv.studytracker.model.User userA = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("isolatedUserA")
                .email("userA@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        com.satyamshiv.studytracker.model.User userB = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
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

    @Test
    @DisplayName("User Isolation: User B cannot see DSA solved by User A")
    void userIsolationDsaTest() throws Exception {
        com.satyamshiv.studytracker.model.User userA = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("dsaUserA")
                .email("dsaA@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        com.satyamshiv.studytracker.model.User userB = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("dsaUserB")
                .email("dsaB@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String userAToken = jwtUtil.generateToken(userA.getId(), userA.getUsername(), userA.getRole());
        String userBToken = jwtUtil.generateToken(userB.getId(), userB.getUsername(), userB.getRole());

        // User A marks Day 5 DSA completed
        mockMvc.perform(post("/api/dsa/me/5/toggle")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk());

        // User B checks DSA list - Day 5 should NOT be present for User B
        mockMvc.perform(get("/api/dsa/me")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().string(
                    org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("\"dayNumber\":5"))
                ));
    }

    @Test
    @DisplayName("User Isolation: User B cannot see private notes saved by User A")
    void userIsolationNotesTest() throws Exception {
        com.satyamshiv.studytracker.model.User userA = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("notesUserA")
                .email("notesA@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        com.satyamshiv.studytracker.model.User userB = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("notesUserB")
                .email("notesB@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String userAToken = jwtUtil.generateToken(userA.getId(), userA.getUsername(), userA.getRole());
        String userBToken = jwtUtil.generateToken(userB.getId(), userB.getUsername(), userB.getRole());

        // User A saves confidential note
        mockMvc.perform(post("/api/notes/me/12")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"UserA secret notes on JVM GC\"}"))
                .andExpect(status().isOk());

        // User B fetches their notes - User A's secret note MUST NOT be present
        mockMvc.perform(get("/api/notes/me")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().string(
                    org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("UserA secret notes"))
                ));
    }

    @Test
    @DisplayName("User Isolation: User B's study hours remain zero when User A logs study sessions")
    void userIsolationStudyHoursTest() throws Exception {
        com.satyamshiv.studytracker.model.User userA = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("studyUserA")
                .email("studyA@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        com.satyamshiv.studytracker.model.User userB = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("studyUserB")
                .email("studyB@isolate.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String userAToken = jwtUtil.generateToken(userA.getId(), userA.getUsername(), userA.getRole());
        String userBToken = jwtUtil.generateToken(userB.getId(), userB.getUsername(), userB.getRole());

        // User A logs a 60 min session
        mockMvc.perform(post("/api/study-sessions/me")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"durationMinutes\":60,\"mode\":\"study\"}"))
                .andExpect(status().isOk());

        // User B queries total-hours - must be 0.0
        mockMvc.perform(get("/api/study-sessions/me/total-hours")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.totalHours").value(0.0));
    }

    @Test
    @DisplayName("Actuator: /actuator/health is publicly accessible for cloud load balancer probes")
    void publicActuatorHealthShouldSucceed() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.status").value("UP"));
    }

    @Test
    @DisplayName("MCP Protocol: Standard JSON-RPC 2.0 tools/list returns compliant schema")
    void mcpJsonRpcToolsListTest() throws Exception {
        com.satyamshiv.studytracker.model.User user = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("mcpUser")
                .email("mcp@test.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        mockMvc.perform(post("/api/mcp/rpc")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"jsonrpc\":\"2.0\",\"id\":42,\"method\":\"tools/list\"}"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.jsonrpc").value("2.0"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.id").value(42))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.result.tools").isArray());
    }

    @Test
    @DisplayName("Protected endpoint /api/rag/documents should return 401 Unauthorized when unauthenticated")
    void protectedRagDocumentsShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/rag/documents"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected endpoint /api/rag/query should return 401 Unauthorized when unauthenticated")
    void protectedRagQueryShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/rag/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"What is JVM?\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected AI endpoint /api/chat should return 401 Unauthorized when unauthenticated")
    void protectedChatShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"activeDayTitle\":\"Day 1\",\"historyContent\":[]}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected AI endpoint /api/career should return 401 Unauthorized when unauthenticated")
    void protectedCareerShouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/career")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"resume\",\"text\":\"Java Backend Developer\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected AI endpoints should allow authenticated users with JWT")
    void protectedAiEndpointsShouldAllowAuthenticated() throws Exception {
        com.satyamshiv.studytracker.model.User user = userRepository.save(com.satyamshiv.studytracker.model.User.builder()
                .username("aiUser")
                .email("ai@test.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        // Authenticated request passes security filter chain (does not return 401/403)
        mockMvc.perform(post("/api/chat")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"activeDayTitle\":\"Day 1\",\"historyContent\":[]}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.junit.jupiter.api.Assertions.assertNotEquals(401, status);
                    org.junit.jupiter.api.Assertions.assertNotEquals(403, status);
                });

        mockMvc.perform(post("/api/career")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"resume\",\"text\":\"Java developer\"}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.junit.jupiter.api.Assertions.assertNotEquals(401, status);
                    org.junit.jupiter.api.Assertions.assertNotEquals(403, status);
                });
    }
}


