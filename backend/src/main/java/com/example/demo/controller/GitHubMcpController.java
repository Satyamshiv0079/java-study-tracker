package com.example.demo.controller;

import com.example.demo.service.GitHubService;
import com.example.demo.service.GitHubService.GitHubSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mcp/github")
@RequiredArgsConstructor
public class GitHubMcpController {

    private final GitHubService gitHubService;

    @GetMapping("/tools")
    public ResponseEntity<List<Map<String, String>>> listGitHubTools() {
        List<Map<String, String>> tools = Arrays.asList(
                Map.of(
                        "name", "get_repositories",
                        "description", "Fetches live public GitHub repositories and primary languages from api.github.com."
                ),
                Map.of(
                        "name", "get_activity_summary",
                        "description", "Live correlation of public GitHub repositories with curriculum milestones."
                )
        );
        return ResponseEntity.ok(tools);
    }

    @PostMapping("/summary")
    public ResponseEntity<GitHubSummaryResponse> getGitHubSummary(@RequestParam(defaultValue = "Satyamshiv0079") String username) {
        GitHubSummaryResponse response = gitHubService.getRepositorySummary(username);
        return ResponseEntity.ok(response);
    }
}
