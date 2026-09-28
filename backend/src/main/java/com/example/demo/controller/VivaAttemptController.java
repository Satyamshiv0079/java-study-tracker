package com.example.demo.controller;

import com.example.demo.dto.RecordVivaRequest;
import com.example.demo.dto.VivaAttemptDto;
import com.example.demo.dto.VivaSummaryDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.VivaAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viva")
@RequiredArgsConstructor
public class VivaAttemptController {

    private final VivaAttemptService vivaService;

    @GetMapping("/me")
    public ResponseEntity<List<VivaAttemptDto>> getMyAttempts(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(vivaService.getUserAttempts(principal.getId()));
    }

    @GetMapping("/me/summary")
    public ResponseEntity<VivaSummaryDto> getMySummary(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(vivaService.getSummary(principal.getId()));
    }

    @PostMapping("/me")
    public ResponseEntity<VivaAttemptDto> recordAttempt(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RecordVivaRequest request) {
        return ResponseEntity.ok(vivaService.recordAttempt(principal.getId(), request));
    }
}
