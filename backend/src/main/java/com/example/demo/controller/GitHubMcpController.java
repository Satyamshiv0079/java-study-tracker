package com.example.demo.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mcp/github")
public class GitHubMcpController {

    @GetMapping("/tools")
    public ResponseEntity<List<Map<String, String>>> listGitHubMcpTools() {
        List<Map<String, String>> tools = Arrays.asList(
                Map.of(
                        "name", "get_repositories",
                        "description", "Fetches student's GitHub public repositories and primary languages."
                ),
                Map.of(
                        "name", "get_recent_commits",
                        "description", "Fetches recent commit history for java-study-tracker repository."
                ),
                Map.of(
                        "name", "get_activity_summary",
                        "description", "Correlates commit frequency with 45-day Java backend curriculum milestones."
                )
        );
        return ResponseEntity.ok(tools);
    }

    @PostMapping("/summary")
    public ResponseEntity<GitHubSummaryResponse> getGitHubSummary(@RequestParam(defaultValue = "Satyamshiv0079") String username) {
        GitHubSummaryResponse response = GitHubSummaryResponse.builder()
                .username(username)
                .primaryLanguages(Arrays.asList("Java", "TypeScript", "PL/pgSQL"))
                .repoCount(5)
                .studyCorrelation("High GitHub commit consistency across Java Spring Boot & Docker features.")
                .build();
        return ResponseEntity.ok(response);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GitHubSummaryResponse {
        private String username;
        private List<String> primaryLanguages;
        private int repoCount;
        private String studyCorrelation;
    }
}
