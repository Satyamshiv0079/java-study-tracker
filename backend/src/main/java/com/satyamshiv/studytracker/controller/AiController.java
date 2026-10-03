package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.AiCareerRequest;
import com.satyamshiv.studytracker.dto.AiChatRequest;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "AI Subsystem", description = "Endpoints for Curriculum Mentor Chat and Career Review")
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Curriculum Mentor Chat", description = "Interactive mentor chat grounded in backend engineering curriculum for authenticated user")
    public ResponseEntity<Map<String, Object>> chat(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AiChatRequest request) {
        Map<String, Object> result = aiService.chat(principal.getId(), request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/career")
    @Operation(summary = "Career & Code Review", description = "Evaluates resumes, LinkedIn profiles, and Java code solutions for authenticated user")
    public ResponseEntity<Map<String, Object>> analyzeCareer(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AiCareerRequest request) {
        Map<String, Object> result = aiService.analyzeCareer(principal.getId(), request);
        return ResponseEntity.ok(result);
    }
}
