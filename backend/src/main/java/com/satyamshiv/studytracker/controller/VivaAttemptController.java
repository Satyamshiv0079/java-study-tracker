package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.RecordVivaRequest;
import com.satyamshiv.studytracker.dto.VivaAttemptDto;
import com.satyamshiv.studytracker.dto.VivaSummaryDto;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.VivaAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping("/me/paged")
    public ResponseEntity<Page<VivaAttemptDto>> getMyAttemptsPaged(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 10, sort = "attemptedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(vivaService.getUserAttemptsPaged(principal.getId(), pageable));
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
