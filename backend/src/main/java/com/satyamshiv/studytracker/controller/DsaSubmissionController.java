package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.DsaSubmissionDto;
import com.satyamshiv.studytracker.dto.DsaSubmissionRequest;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.DsaSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsa")
@RequiredArgsConstructor
@Tag(name = "DSA Problem Tracking", description = "Endpoints for logging code submissions, problem statuses, and LeetCode solutions")
public class DsaSubmissionController {

    private final DsaSubmissionService dsaService;

    @GetMapping("/me")
    @Operation(summary = "Get user DSA submissions", description = "Fetches all DSA problem submissions, code snippets, and completion statuses for the authenticated user.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Submissions retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required")
    })
    public ResponseEntity<List<DsaSubmissionDto>> getMySubmissions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dsaService.getUserSubmissions(principal.getId()));
    }

    @GetMapping("/me/{dayNumber}")
    @Operation(summary = "Get DSA submission for a day", description = "Fetches submission details including source code, language, and problem notes for a specific day.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Submission found"),
        @ApiResponse(responseCode = "404", description = "No submission found for this day"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<DsaSubmissionDto> getMySubmissionForDay(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        DsaSubmissionDto dto = dsaService.getSubmissionByDay(principal.getId(), dayNumber);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/me")
    @Operation(summary = "Save or update DSA submission", description = "Saves code, problem title, LeetCode link, and completion status for a specific curriculum day.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Submission saved successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error on submission payload"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<DsaSubmissionDto> saveSubmission(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody DsaSubmissionRequest request) {
        return ResponseEntity.ok(dsaService.saveOrUpdate(principal.getId(), request));
    }

    @PostMapping("/me/{dayNumber}/toggle")
    @Operation(summary = "Toggle DSA completion status", description = "Toggles solved/unsolved status for a specific day's DSA problem.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status toggled successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<DsaSubmissionDto> toggleSubmission(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        return ResponseEntity.ok(dsaService.toggleCompleted(principal.getId(), dayNumber));
    }
}
