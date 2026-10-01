package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.DayProgressDto;
import com.satyamshiv.studytracker.model.DayProgress;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.DayProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Curriculum & Progress", description = "Endpoints for tracking user completion of the 45-day syllabus")
public class DayProgressController {

    private final DayProgressService progressService;

    /**
     * GET /api/progress/me — returns the authenticated user's own progress.
     * The userId comes from the JWT token, never from the request.
     */
    @GetMapping("/me")
    @Operation(summary = "Get current user syllabus progress", description = "Fetches completed day statuses for the authenticated user from the database.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Progress retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required")
    })
    public ResponseEntity<List<DayProgressDto>> getMyProgress(@AuthenticationPrincipal UserPrincipal principal) {
        List<DayProgressDto> dtos = progressService.getUserProgress(principal.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * POST /api/progress/me/{dayNumber} — toggles a day for the authenticated user.
     */
    @PostMapping("/me/{dayNumber}")
    @Operation(summary = "Toggle day completion", description = "Toggles completed status for specified day number (1-45) for the authenticated user.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Day toggled successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required")
    })
    public ResponseEntity<DayProgressDto> toggleMyDayProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        DayProgress progress = progressService.toggleDay(principal.getId(), dayNumber);
        return ResponseEntity.ok(toDto(progress));
    }

    private DayProgressDto toDto(DayProgress entity) {
        return DayProgressDto.builder()
                .id(entity.getId())
                .dayNumber(entity.getDayNumber())
                .completed(entity.isCompleted())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .build();
    }
}
