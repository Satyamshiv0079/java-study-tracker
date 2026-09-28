package com.example.demo.controller;

import com.example.demo.dto.DsaSubmissionDto;
import com.example.demo.dto.DsaSubmissionRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.DsaSubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsa")
@RequiredArgsConstructor
public class DsaSubmissionController {

    private final DsaSubmissionService dsaService;

    @GetMapping("/me")
    public ResponseEntity<List<DsaSubmissionDto>> getMySubmissions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dsaService.getUserSubmissions(principal.getId()));
    }

    @GetMapping("/me/{dayNumber}")
    public ResponseEntity<DsaSubmissionDto> getMySubmissionForDay(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        DsaSubmissionDto dto = dsaService.getSubmissionByDay(principal.getId(), dayNumber);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/me")
    public ResponseEntity<DsaSubmissionDto> saveSubmission(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody DsaSubmissionRequest request) {
        return ResponseEntity.ok(dsaService.saveOrUpdate(principal.getId(), request));
    }

    @PostMapping("/me/{dayNumber}/toggle")
    public ResponseEntity<DsaSubmissionDto> toggleSubmission(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        return ResponseEntity.ok(dsaService.toggleCompleted(principal.getId(), dayNumber));
    }
}
