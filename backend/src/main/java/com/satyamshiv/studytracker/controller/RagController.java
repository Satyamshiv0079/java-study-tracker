package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.RagQueryDto;
import com.satyamshiv.studytracker.dto.RagResponseDto;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.RagProxyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
public class RagController {

    private final RagProxyService ragProxyService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(ragProxyService.checkHealth());
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ragProxyService.uploadDocument(principal.getId(), file));
    }

    @GetMapping("/documents")
    public ResponseEntity<Map<String, Object>> listDocuments(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ragProxyService.listDocuments(principal.getId()));
    }

    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Map<String, Object>> deleteDocument(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String documentId) {
        return ResponseEntity.ok(ragProxyService.deleteDocument(principal.getId(), documentId));
    }

    @PostMapping("/query")
    public ResponseEntity<RagResponseDto> queryRag(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RagQueryDto queryDto) {
        return ResponseEntity.ok(ragProxyService.queryRag(principal.getId(), queryDto));
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugQuery(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "Java") String question) {
        return ResponseEntity.ok(ragProxyService.debugQuery(principal.getId(), question));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> runEvaluation(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "4") Integer topK) {
        return ResponseEntity.ok(ragProxyService.evaluate(principal.getId(), topK));
    }
}
