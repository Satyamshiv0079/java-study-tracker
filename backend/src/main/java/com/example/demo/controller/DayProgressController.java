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

    @GetMapping("/me")
    public ResponseEntity<List<DayProgressDto>> getMyProgress(@AuthenticationPrincipal UserPrincipal principal) {
        Long activeUserId = resolveUserId(principal, null);
        List<DayProgressDto> dtos = progressService.getUserProgress(activeUserId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/me/{dayNumber}")
    public ResponseEntity<DayProgressDto> toggleMyDayProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        Long activeUserId = resolveUserId(principal, null);
        DayProgress progress = progressService.toggleDay(activeUserId, dayNumber);
        return ResponseEntity.ok(toDto(progress));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<DayProgressDto>> getUserProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long userId) {
        Long activeUserId = resolveUserId(principal, userId);
        List<DayProgressDto> dtos = progressService.getUserProgress(activeUserId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{userId}/{dayNumber}")
    public ResponseEntity<DayProgressDto> toggleDayProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long userId,
            @PathVariable int dayNumber) {
        Long activeUserId = resolveUserId(principal, userId);
        DayProgress progress = progressService.toggleDay(activeUserId, dayNumber);
        return ResponseEntity.ok(toDto(progress));
    }

    private Long resolveUserId(UserPrincipal principal, Long requestedUserId) {
        if (principal != null) {
            // User Isolation: Non-admin users can ONLY access their own resources!
            if (requestedUserId != null && !requestedUserId.equals(principal.getId()) && !"ROLE_ADMIN".equals(principal.getRole())) {
                throw new RuntimeException("Forbidden: You cannot access or modify another user's progress data");
            }
            return principal.getId();
        }
        // Fallback to requested userId for unauthenticated/demo mode
        return requestedUserId != null ? requestedUserId : 1L;
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
