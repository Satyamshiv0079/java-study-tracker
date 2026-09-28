package com.example.demo.service;

import com.example.demo.dto.KnowledgeSearchResultDto;
import com.example.demo.model.KnowledgeDocument;
import com.example.demo.repository.KnowledgeDocumentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Semantic & Citation Search Service for curriculum knowledge documents.
 * Powers RAG (Retrieval-Augmented Generation) query lookups for the AI Mentor
 * and students searching technical topics with verified syllabus citations.
 */
@Service
@RequiredArgsConstructor
public class KnowledgeSearchService {

    private final KnowledgeDocumentRepository knowledgeRepository;

    @PostConstruct
    public void initCurriculumIfEmpty() {
        if (knowledgeRepository.count() == 0) {
            seedCoreCurriculum();
        }
    }

    public List<KnowledgeSearchResultDto> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedQuery = query.toLowerCase(Locale.ROOT).trim();
        Set<String> queryTokens = Arrays.stream(normalizedQuery.split("\\W+"))
                .filter(token -> token.length() > 2)
                .collect(Collectors.toSet());

        if (queryTokens.isEmpty()) {
            queryTokens.add(normalizedQuery);
        }

        List<KnowledgeDocument> allDocs = knowledgeRepository.findAll();
        List<KnowledgeSearchResultDto> results = new ArrayList<>();

        for (KnowledgeDocument doc : allDocs) {
            double score = computeRelevanceScore(doc, queryTokens, normalizedQuery);
            if (score > 0.0) {
                String snippet = extractSnippet(doc.getContent(), queryTokens);
                String citation = String.format("[Day %s: %s (%s)]",
                        doc.getDayNumber() != null ? doc.getDayNumber() : "N/A",
                        doc.getTitle(),
                        doc.getCategory());

                results.add(KnowledgeSearchResultDto.builder()
                        .id(doc.getId())
                        .title(doc.getTitle())
                        .category(doc.getCategory())
                        .dayNumber(doc.getDayNumber())
                        .relevanceScore(Math.round(score * 100.0) / 100.0)
                        .highlightSnippet(snippet)
                        .citationTag(citation)
                        .build());
            }
        }

        // Sort descending by relevance score
        results.sort((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()));
        return results;
    }

    private double computeRelevanceScore(KnowledgeDocument doc, Set<String> queryTokens, String fullQuery) {
        double score = 0.0;
        String titleLower = doc.getTitle().toLowerCase(Locale.ROOT);
        String contentLower = doc.getContent().toLowerCase(Locale.ROOT);
        String categoryLower = doc.getCategory().toLowerCase(Locale.ROOT);

        // Exact full phrase bonus
        if (titleLower.contains(fullQuery)) {
            score += 5.0;
        }
        if (contentLower.contains(fullQuery)) {
            score += 3.0;
        }

        // Token matches
        for (String token : queryTokens) {
            if (titleLower.contains(token)) {
                score += 2.5;
            }
            if (categoryLower.contains(token)) {
                score += 1.5;
            }
            // Count occurrences in content (capped to avoid keyword stuffing)
            int count = 0;
            int idx = 0;
            while ((idx = contentLower.indexOf(token, idx)) != -1 && count < 5) {
                count++;
                idx += token.length();
            }
            score += (count * 0.5);
        }

        return score;
    }

    private String extractSnippet(String content, Set<String> queryTokens) {
        if (content == null || content.isBlank()) {
            return "";
        }
        String contentLower = content.toLowerCase(Locale.ROOT);

        int bestIndex = -1;
        for (String token : queryTokens) {
            int idx = contentLower.indexOf(token);
            if (idx != -1 && (bestIndex == -1 || idx < bestIndex)) {
                bestIndex = idx;
            }
        }

        if (bestIndex == -1) {
            return content.length() > 180 ? content.substring(0, 180) + "..." : content;
        }

        int start = Math.max(0, bestIndex - 60);
        int end = Math.min(content.length(), bestIndex + 120);

        String snippet = content.substring(start, end).trim();
        if (start > 0) snippet = "..." + snippet;
        if (end < content.length()) snippet = snippet + "...";

        return snippet;
    }

    private void seedCoreCurriculum() {
        List<KnowledgeDocument> seedDocs = List.of(
            KnowledgeDocument.builder()
                .title("Java Memory Management & Garbage Collection")
                .category("Core Java")
                .dayNumber(1)
                .content("JVM memory is divided into Heap (Eden, Survivor, Tenured/Old generation) and Metaspace/Stack. " +
                         "Stack holds primitive values and object references for thread execution frames. " +
                         "Garbage Collectors include G1GC (Garbage-First), ZGC (low-latency concurrent collector), and Parallel GC. " +
                         "Objects move from Young to Old generation through generational tenuring thresholds.")
                .build(),

            KnowledgeDocument.builder()
                .title("HashMap Internal Implementation & Collision Handling")
                .category("Collections")
                .dayNumber(3)
                .content("HashMap uses an array of Node buckets with hashing via (n - 1) & hash. " +
                         "In Java 8+, when bucket collisions exceed the TREEIFY_THRESHOLD of 8 and capacity >= 64, " +
                         "the bucket transforms from a linked list (O(n)) into a Red-Black Balanced Binary Search Tree (O(log n)). " +
                         "ConcurrentHashMap achieves thread safety via CAS on table bins and synchronized locking per bucket node.")
                .build(),

            KnowledgeDocument.builder()
                .title("Spring Core: IoC Container & Bean Lifecycle")
                .category("Spring Boot")
                .dayNumber(14)
                .content("The Spring IoC (Inversion of Control) container manages bean creation, dependency injection, and destruction. " +
                         "Bean lifecycle order: Instantiation -> Populate Properties -> BeanNameAware / BeanFactoryAware -> " +
                         "BeanPostProcessor (postProcessBeforeInitialization) -> @PostConstruct / InitializingBean -> " +
                         "BeanPostProcessor (postProcessAfterInitialization) -> Ready for use -> @PreDestroy / DisposableBean. " +
                         "Bean scopes include singleton (default), prototype, request, session, and application.")
                .build(),

            KnowledgeDocument.builder()
                .title("Spring Boot Auto-Configuration & DispatcherServlet Architecture")
                .category("Spring Boot")
                .dayNumber(21)
                .content("Spring Boot auto-configuration relies on @EnableAutoConfiguration and META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. " +
                         "Conditional annotations such as @ConditionalOnClass, @ConditionalOnMissingBean, and @ConditionalOnProperty ensure beans are created only when relevant libraries and settings are active. " +
                         "Incoming HTTP requests are routed to DispatcherServlet, which delegates to HandlerMapping, HandlerAdapter, Interceptors, Controllers, and HttpMessageConverters.")
                .build(),

            KnowledgeDocument.builder()
                .title("Spring Data JPA & Hibernate Performance: Solving N+1 Problem")
                .category("Database & Persistence")
                .dayNumber(28)
                .content("The N+1 select problem occurs when fetching an entity with lazy relationships triggers 1 initial query plus N subsequent queries for associated children. " +
                         "Solutions include: 1. JOIN FETCH in JPQL queries, 2. @EntityGraph with attributePaths, 3. @BatchSize(size = 20) to batch child lookups via SQL IN clauses. " +
                         "First-level cache (L1) is scoped to the JPA EntityManager / Hibernate Session; Second-level cache (L2) is cross-session.")
                .build(),

            KnowledgeDocument.builder()
                .title("Spring Security Filter Chain & Stateless JWT Architecture")
                .category("Security")
                .dayNumber(35)
                .content("Spring Security intercepts web requests through DelegatingFilterProxy and FilterChainProxy. " +
                         "In a stateless JWT architecture, SessionCreationPolicy is configured as STATELESS, CSRF is disabled for bearer tokens, " +
                         "and a custom OncePerRequestFilter validates the Authorization Bearer header, sets the authenticated UserPrincipal inside SecurityContextHolder, " +
                         "enabling @AuthenticationPrincipal injection into Spring controllers.")
                .build()
        );

        knowledgeRepository.saveAll(seedDocs);
    }
}
