package com.example.demo.controller;

import com.example.demo.service.GitHubService;
import com.example.demo.service.GitHubService.GitHubSummaryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping({"/api/tools/github", "/api/mcp/github"})
@RequiredArgsConstructor
@Tag(name = "Developer GitHub Integration", description = "Live GitHub API integration for repository analysis and portfolio milestone verification")
public class GitHubMcpController {

    private final GitHubService gitHubService;

    @GetMapping("/tools")
    @Operation(summary = "List GitHub AI tools", description = "Returns available GitHub tools for AI assistants.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tool list retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
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
    @Operation(summary = "Fetch GitHub repository summary", description = "Live query against api.github.com correlating public repositories with syllabus milestones with 15-minute TTL caching.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "GitHub summary retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "GitHub user not found"),
        @ApiResponse(responseCode = "429", description = "GitHub API rate limit exceeded")
    })
    public ResponseEntity<GitHubSummaryResponse> getGitHubSummary(@RequestParam(defaultValue = "Satyamshiv0079") String username) {
        GitHubSummaryResponse response = gitHubService.getRepositorySummary(username);
        return ResponseEntity.ok(response);
    }
}
