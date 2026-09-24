package com.example.demo.controller;

import com.example.demo.service.DayProgressService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mcp")
@RequiredArgsConstructor
public class McpController {

    private final DayProgressService progressService;

    @GetMapping("/tools")
    public ResponseEntity<McpToolListResponse> listMcpTools() {
        List<McpTool> tools = Arrays.asList(
                McpTool.builder()
                        .name("get_user_progress")
                        .description("Returns progress metrics for authenticated user including completed days and percentage.")
                        .build(),
                McpTool.builder()
                        .name("get_curriculum_gaps")
                        .description("Identifies missing curriculum days and recommended focus areas.")
                        .build()
        );
        return ResponseEntity.ok(McpToolListResponse.builder().tools(tools).build());
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeMcpTool(
            @RequestParam Long userId,
            @RequestParam String toolName) {
        
        Map<String, Object> result = new HashMap<>();
        var progressList = progressService.getUserProgress(userId);
        long completedCount = progressList.stream().filter(p -> p.isCompleted()).count();

        if ("get_user_progress".equals(toolName)) {
            result.put("userId", userId);
            result.put("completedDaysCount", completedCount);
            result.put("totalDays", 45);
            result.put("completionPercentage", Math.round((completedCount / 45.0) * 100));
        } else if ("get_curriculum_gaps".equals(toolName)) {
            result.put("userId", userId);
            result.put("pendingDaysCount", 45 - completedCount);
            result.put("recommendedFocus", completedCount < 10 ? "Java Fundamentals & JVM Memory" : "Spring Boot & REST APIs");
        } else {
            result.put("error", "Unknown MCP Tool: " + toolName);
        }

        return ResponseEntity.ok(result);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class McpTool {
        private String name;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class McpToolListResponse {
        private List<McpTool> tools;
    }
}
