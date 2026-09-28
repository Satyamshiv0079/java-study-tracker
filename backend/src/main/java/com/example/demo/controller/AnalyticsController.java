package com.example.demo.controller;

import com.example.demo.dto.AnalyticsOverviewDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/me")
    public ResponseEntity<AnalyticsOverviewDto> getMyAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.calculateUserAnalytics(principal.getId()));
    }
}
