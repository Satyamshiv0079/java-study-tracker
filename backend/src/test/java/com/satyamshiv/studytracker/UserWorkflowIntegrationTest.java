package com.satyamshiv.studytracker;

import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.UserRepository;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestPropertySource(properties = {
    "JWT_SECRET=superSecretKeyForMockMvcSecurityIntegrationTesting2026AtLeast32Bytes!"
})
class UserWorkflowIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

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
    @DisplayName("Registration: Succeeds with 200 and returns signed JWT token")
    void registerUserSuccess() throws Exception {
        String payload = """
            {
                "username": "freshStudent1",
                "email": "fresh1@domain.com",
                "password": "Password123!"
            }
            """;

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.username").value("freshStudent1"))
                .andExpect(jsonPath("$.email").value("fresh1@domain.com"));
    }

    @Test
    @DisplayName("Registration: Fails with 400 Bad Request when payload is invalid")
    void registerUserValidationFailure() throws Exception {
        String invalidPayload = """
            {
                "username": "",
                "email": "not-an-email",
                "password": "123"
            }
            """;

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    @DisplayName("Registration: Fails with 409 Conflict when username already exists")
    void registerUserDuplicateUsername() throws Exception {
        userRepository.save(User.builder()
                .username("existingUserX")
                .email("uniqueX@domain.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .role("ROLE_USER")
                .build());

        String payload = """
            {
                "username": "existingUserX",
                "email": "anotherEmail@domain.com",
                "password": "Password123!"
            }
            """;

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Username 'existingUserX' is already taken"));
    }

    @Test
    @DisplayName("Registration: Fails with 409 Conflict when email already exists")
    void registerUserDuplicateEmail() throws Exception {
        userRepository.save(User.builder()
                .username("uniqueUserY")
                .email("duplicateEmail@domain.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .role("ROLE_USER")
                .build());

        String payload = """
            {
                "username": "freshUserY",
                "email": "duplicateEmail@domain.com",
                "password": "Password123!"
            }
            """;

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Email 'duplicateEmail@domain.com' is already registered"));
    }

    @Test
    @DisplayName("Authentication: Fails with 401 Unauthorized when password does not match")
    void loginInvalidCredentials() throws Exception {
        String payload = """
            {
                "username": "nonExistentUserOrWrongPass",
                "password": "WrongPassword123!"
            }
            """;

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("Pagination: /api/study-sessions/me/paged returns Page metadata")
    void studySessionsPagedReturnsPageStructure() throws Exception {
        User user = userRepository.save(User.builder()
                .username("pagedStudyUser")
                .email("pagedStudy@domain.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        // Log two study sessions
        mockMvc.perform(post("/api/study-sessions/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"durationMinutes\":25,\"mode\":\"pomodoro\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/study-sessions/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"durationMinutes\":50,\"mode\":\"deep-work\"}"))
                .andExpect(status().isOk());

        // Fetch paged with size=1
        mockMvc.perform(get("/api/study-sessions/me/paged?page=0&size=1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.size").value(1))
                .andExpect(jsonPath("$.number").value(0));
    }

    @Test
    @DisplayName("Pagination: /api/viva/me/paged returns Page metadata")
    void vivaAttemptsPagedReturnsPageStructure() throws Exception {
        User user = userRepository.save(User.builder()
                .username("pagedVivaUser")
                .email("pagedViva@domain.com")
                .password("hash123")
                .role("ROLE_USER")
                .build());

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        // Record a viva attempt
        mockMvc.perform(post("/api/viva/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "category": "Spring Boot",
                                "question": "What is @SpringBootApplication?",
                                "userAnswer": "Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan",
                                "score": 9,
                                "feedback": "Excellent answer"
                            }
                            """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/viva/me/paged?page=0&size=5")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].score").value(9))
                .andExpect(jsonPath("$.content[0].passed").value(true));
    }
}
