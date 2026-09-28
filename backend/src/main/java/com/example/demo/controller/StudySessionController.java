package com.example.demo.controller;

import com.example.demo.dto.LogSessionRequest;
import com.example.demo.dto.StudySessionDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.StudySessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService sessionService;

    @GetMapping("/me")
    public ResponseEntity<List<StudySessionDto>> getMySessions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(sessionService.getUserSessions(principal.getId()));
    }

    @GetMapping("/me/total-hours")
    public ResponseEntity<Map<String, Object>> getMyTotalStudyHours(@AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("totalHours", sessionService.getTotalStudyHours(principal.getId()));
        response.put("totalMinutes", sessionService.getTotalStudyMinutes(principal.getId()));
        response.put("sessionCount", sessionService.getSessionCount(principal.getId()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me")
    public ResponseEntity<StudySessionDto> logSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LogSessionRequest request) {
        return ResponseEntity.ok(sessionService.logSession(principal.getId(), request));
    }
}
