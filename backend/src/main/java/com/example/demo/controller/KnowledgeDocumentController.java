package com.example.demo.controller;

import com.example.demo.model.KnowledgeDocument;
import com.example.demo.repository.KnowledgeDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
public class KnowledgeDocumentController {

    private final KnowledgeDocumentRepository knowledgeRepository;

    @GetMapping
    public ResponseEntity<List<KnowledgeDocument>> getAllDocuments() {
        return ResponseEntity.ok(knowledgeRepository.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<KnowledgeDocument>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(knowledgeRepository.findByCategory(category));
    }

    @GetMapping("/day/{dayNumber}")
    public ResponseEntity<List<KnowledgeDocument>> getByDay(@PathVariable Integer dayNumber) {
        return ResponseEntity.ok(knowledgeRepository.findByDayNumber(dayNumber));
    }

    @PostMapping
    public ResponseEntity<KnowledgeDocument> createDocument(@RequestBody KnowledgeDocument document) {
        return ResponseEntity.ok(knowledgeRepository.save(document));
    }
}
