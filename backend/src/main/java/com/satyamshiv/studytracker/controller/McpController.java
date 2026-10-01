package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.KnowledgeSearchResultDto;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.DayProgressService;
import com.satyamshiv.studytracker.service.GitHubService;
import com.satyamshiv.studytracker.service.KnowledgeSearchService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * AI Tool Integration & Model Context Protocol (MCP) Server.
 * Supports both direct REST tool invocation and standard JSON-RPC 2.0 MCP protocol
 * (tools/list and tools/call) for integration with LLM agents (Claude, Gemini, Cursor).
 */
@Slf4j
@RestController
@RequestMapping({"/api/tools", "/api/mcp"})
@RequiredArgsConstructor
@Tag(name = "AI Tools & MCP Integration", description = "Endpoints for AI assistant tool discovery, execution, and JSON-RPC 2.0 Model Context Protocol (MCP) server")
public class McpController {

    private final DayProgressService progressService;
    private final GitHubService gitHubService;
    private final KnowledgeSearchService knowledgeSearchService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // --- REST Endpoints ---

    @GetMapping("/tools")
    @Operation(summary = "List available AI tools", description = "Returns descriptors and schemas for all tools callable by AI agents or student assistants.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tool list"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - JWT token missing or expired")
    })
    public ResponseEntity<McpToolListResponse> listTools() {
        return ResponseEntity.ok(McpToolListResponse.builder().tools(getToolDefinitions()).build());
    }

    @PostMapping("/execute")
    @Operation(summary = "Execute an AI tool via REST", description = "Invokes a specific tool by name with provided arguments for the authenticated user.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tool execution completed"),
        @ApiResponse(responseCode = "400", description = "Invalid tool name or missing required parameters"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Map<String, Object>> executeTool(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String toolName,
            @RequestBody(required = false) Map<String, Object> arguments) {

        Map<String, Object> args = arguments != null ? arguments : Collections.emptyMap();
        Map<String, Object> result = dispatchTool(principal != null ? principal.getId() : null, toolName, args);
        return ResponseEntity.ok(result);
    }

    // --- Standard Model Context Protocol (MCP) JSON-RPC 2.0 Endpoint ---

    @PostMapping("/rpc")
    @Operation(summary = "Model Context Protocol (MCP) JSON-RPC 2.0 handler",
               description = "Standard MCP RPC endpoint supporting 'tools/list' and 'tools/call' methods conforming to Anthropic MCP specifications.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "JSON-RPC 2.0 response returned successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<JsonRpcResponse> handleMcpRpc(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody JsonRpcRequest request) {

        if (request == null || request.getMethod() == null) {
            return ResponseEntity.ok(JsonRpcResponse.builder()
                    .jsonrpc("2.0")
                    .id(request != null ? request.getId() : null)
                    .error(new JsonRpcError(-32600, "Invalid Request: method is required"))
                    .build());
        }

        Long userId = principal != null ? principal.getId() : null;

        switch (request.getMethod()) {
            case "tools/list": {
                return ResponseEntity.ok(JsonRpcResponse.builder()
                        .jsonrpc("2.0")
                        .id(request.getId())
                        .result(Map.of("tools", getToolDefinitions()))
                        .build());
            }

            case "tools/call": {
                Map<String, Object> params = request.getParams() != null ? request.getParams() : Collections.emptyMap();
                String toolName = (String) params.get("name");
                @SuppressWarnings("unchecked")
                Map<String, Object> args = params.containsKey("arguments") && params.get("arguments") instanceof Map
                        ? (Map<String, Object>) params.get("arguments")
                        : Collections.emptyMap();

                if (toolName == null || toolName.isBlank()) {
                    return ResponseEntity.ok(JsonRpcResponse.builder()
                            .jsonrpc("2.0")
                            .id(request.getId())
                            .error(new JsonRpcError(-32602, "Invalid params: 'name' is required for tools/call"))
                            .build());
                }

                Map<String, Object> executionResult = dispatchTool(userId, toolName, args);
                try {
                    String textOutput = objectMapper.writeValueAsString(executionResult);
                    return ResponseEntity.ok(JsonRpcResponse.builder()
                            .jsonrpc("2.0")
                            .id(request.getId())
                            .result(Map.of("content", List.of(Map.of("type", "text", "text", textOutput))))
                            .build());
                } catch (Exception e) {
                    log.error("Failed to serialize MCP tool output", e);
                    return ResponseEntity.ok(JsonRpcResponse.builder()
                            .jsonrpc("2.0")
                            .id(request.getId())
                            .error(new JsonRpcError(-32603, "Internal tool execution error: " + e.getMessage()))
                            .build());
                }
            }

            default: {
                return ResponseEntity.ok(JsonRpcResponse.builder()
                        .jsonrpc("2.0")
                        .id(request.getId())
                        .error(new JsonRpcError(-32601, "Method not found: " + request.getMethod()))
                        .build());
            }
        }
    }

    // --- Tool Execution Dispatcher ---

    private Map<String, Object> dispatchTool(Long userId, String toolName, Map<String, Object> args) {
        Map<String, Object> result = new HashMap<>();

        switch (toolName) {
            case "get_user_progress": {
                if (userId == null) {
                    result.put("error", "Authentication required to retrieve personal progress.");
                    return result;
                }
                var progressList = progressService.getUserProgress(userId);
                long completedCount = progressList.stream().filter(p -> p.isCompleted()).count();
                result.put("userId", userId);
                result.put("completedDaysCount", completedCount);
                result.put("totalDays", 45);
                result.put("completionPercentage", Math.round((completedCount / 45.0) * 100));
                return result;
            }

            case "get_curriculum_gaps": {
                if (userId == null) {
                    result.put("error", "Authentication required to identify curriculum gaps.");
                    return result;
                }
                var progressList = progressService.getUserProgress(userId);
                long completedCount = progressList.stream().filter(p -> p.isCompleted()).count();
                result.put("userId", userId);
                result.put("pendingDaysCount", 45 - completedCount);
                result.put("recommendedFocus", completedCount < 10
                        ? "Java Fundamentals, OOP & JVM Memory"
                        : completedCount < 25
                        ? "Spring Boot, REST APIs, & JPA / Hibernate"
                        : "Microservices, Kafka, Redis & Production Deployment");
                return result;
            }

            case "get_github_summary": {
                String username = (String) args.getOrDefault("username", "Satyamshiv0079");
                var summary = gitHubService.getRepositorySummary(username);
                result.put("username", summary.getUsername());
                result.put("repoCount", summary.getRepoCount());
                result.put("primaryLanguages", summary.getPrimaryLanguages());
                result.put("studyCorrelation", summary.getStudyCorrelation());
                result.put("isLiveApi", summary.isLiveApi());
                result.put("cachedAt", summary.getCachedAt());
                return result;
            }

            case "search_curriculum": {
                String query = (String) args.getOrDefault("query", "");
                List<KnowledgeSearchResultDto> matches = knowledgeSearchService.search(query);
                result.put("query", query);
                result.put("totalMatches", matches.size());
                result.put("results", matches);
                return result;
            }

            default: {
                result.put("error", "Unknown tool: " + toolName);
                return result;
            }
        }
    }

    private List<McpTool> getToolDefinitions() {
        return List.of(
                McpTool.builder()
                        .name("get_user_progress")
                        .description("Returns progress metrics for authenticated user including completed curriculum days and overall percentage.")
                        .inputSchema(Map.of("type", "object", "properties", Collections.emptyMap()))
                        .build(),
                McpTool.builder()
                        .name("get_curriculum_gaps")
                        .description("Identifies missing curriculum days and returns recommended next focus areas based on current progress.")
                        .inputSchema(Map.of("type", "object", "properties", Collections.emptyMap()))
                        .build(),
                McpTool.builder()
                        .name("get_github_summary")
                        .description("Fetches live repository summary and curriculum correlation for a GitHub user.")
                        .inputSchema(Map.of(
                                "type", "object",
                                "properties", Map.of("username", Map.of("type", "string", "description", "GitHub username")),
                                "required", List.of("username")
                        ))
                        .build(),
                McpTool.builder()
                        .name("search_curriculum")
                        .description("Performs semantic search across the 45-day Java/Spring curriculum and returns verified syllabus citations.")
                        .inputSchema(Map.of(
                                "type", "object",
                                "properties", Map.of("query", Map.of("type", "string", "description", "Search query or technical question")),
                                "required", List.of("query")
                        ))
                        .build()
        );
    }

    // --- DTOs ---

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class McpTool {
        private String name;
        private String description;
        private Map<String, Object> inputSchema;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class McpToolListResponse {
        private List<McpTool> tools;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JsonRpcRequest {
        private String jsonrpc;
        private Object id;
        private String method;
        private Map<String, Object> params;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class JsonRpcResponse {
        private String jsonrpc;
        private Object id;
        private Object result;
        private JsonRpcError error;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JsonRpcError {
        private int code;
        private String message;
    }
}
