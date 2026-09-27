package com.example.demo.controller;

import com.example.demo.dto.DayProgressDto;
import com.example.demo.model.DayProgress;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.DayProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class DayProgressController {

    private final DayProgressService progressService;

    /**
     * GET /api/progress/me — returns the authenticated user's own progress.
     * The userId comes from the JWT token, never from the request.
     */
    @GetMapping("/me")
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
