package com.example.demo.controller;

import com.example.demo.model.DayProgress;
import com.example.demo.service.DayProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class DayProgressController {

    private final DayProgressService progressService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<DayProgress>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getUserProgress(userId));
    }

    @PostMapping("/{userId}/{dayNumber}")
    public ResponseEntity<DayProgress> toggleDayProgress(@PathVariable Long userId, @PathVariable int dayNumber) {
        return ResponseEntity.ok(progressService.toggleDay(userId, dayNumber));
    }
}
