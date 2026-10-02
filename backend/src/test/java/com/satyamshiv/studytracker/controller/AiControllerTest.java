package com.satyamshiv.studytracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satyamshiv.studytracker.dto.AiCareerRequest;
import com.satyamshiv.studytracker.dto.AiChatRequest;
import com.satyamshiv.studytracker.service.AiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AiControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AiService aiService;

    @InjectMocks
    private AiController aiController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(aiController).build();
    }

    @Test
    @DisplayName("POST /api/chat should call AiService and return 200 OK")
    void testChatEndpoint() throws Exception {
        AiChatRequest request = AiChatRequest.builder()
                .activeDayTitle("Day 10 - Collections")
                .historyContent(List.of(Map.of("role", "user", "parts", List.of(Map.of("text", "Explain HashMap")))))
                .build();

        Map<String, Object> mockResponse = Map.of(
                "candidates", List.of(
                        Map.of("content", Map.of("parts", List.of(Map.of("text", "HashMap uses hashing."))))
                )
        );

        when(aiService.chat(any(AiChatRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.candidates").isArray());
    }

    @Test
    @DisplayName("POST /api/career should call AiService and return 200 OK")
    void testCareerEndpoint() throws Exception {
        AiCareerRequest request = AiCareerRequest.builder()
                .type("resume")
                .text("Senior Java Developer with Spring Boot experience")
                .targetRole("Java Engineer")
                .build();

        Map<String, Object> mockResponse = Map.of(
                "atsScore", 85,
                "summary", "Strong Java profile."
        );

        when(aiService.analyzeCareer(any(AiCareerRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/career")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.atsScore").value(85));
    }
}
