package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.AiCareerRequest;
import com.satyamshiv.studytracker.dto.AiChatRequest;
import com.satyamshiv.studytracker.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "AI Subsystem", description = "Endpoints for Curriculum Mentor Chat and Career Review")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Curriculum Mentor Chat", description = "Interactive mentor chat grounded in backend engineering curriculum")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody AiChatRequest request) {
        Map<String, Object> result = aiService.chat(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/career")
    @Operation(summary = "Career & Code Review", description = "Evaluates resumes, LinkedIn profiles, and Java code solutions")
    public ResponseEntity<Map<String, Object>> analyzeCareer(@RequestBody AiCareerRequest request) {
        Map<String, Object> result = aiService.analyzeCareer(request);
        return ResponseEntity.ok(result);
    }
}
