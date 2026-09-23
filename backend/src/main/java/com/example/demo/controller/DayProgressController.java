package com.example.demo.controller;

import com.example.demo.dto.DayProgressDto;
import com.example.demo.model.DayProgress;
import com.example.demo.service.DayProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class DayProgressController {

    private final DayProgressService progressService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<DayProgressDto>> getUserProgress(@PathVariable Long userId) {
        List<DayProgressDto> dtos = progressService.getUserProgress(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{userId}/{dayNumber}")
    public ResponseEntity<DayProgressDto> toggleDayProgress(@PathVariable Long userId, @PathVariable int dayNumber) {
        DayProgress progress = progressService.toggleDay(userId, dayNumber);
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
