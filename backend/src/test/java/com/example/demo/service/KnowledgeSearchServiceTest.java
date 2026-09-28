package com.example.demo.service;

import com.example.demo.dto.KnowledgeSearchResultDto;
import com.example.demo.model.KnowledgeDocument;
import com.example.demo.repository.KnowledgeDocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KnowledgeSearchServiceTest {

    @Mock
    private KnowledgeDocumentRepository knowledgeRepository;

    private KnowledgeSearchService searchService;

    private List<KnowledgeDocument> sampleCurriculum;

    @BeforeEach
    void setUp() {
        searchService = new KnowledgeSearchService(knowledgeRepository);

        sampleCurriculum = List.of(
            KnowledgeDocument.builder()
                .id(1L)
                .title("Java Memory Management & Garbage Collection")
                .category("Core Java")
                .dayNumber(1)
                .content("JVM memory is divided into Heap (Eden, Survivor, Tenured/Old generation) and Metaspace/Stack. G1GC and ZGC manage heap eviction.")
                .build(),

            KnowledgeDocument.builder()
                .id(2L)
                .title("HashMap Internal Implementation & Collision Handling")
                .category("Collections")
                .dayNumber(3)
                .content("In Java 8+, when bucket collisions exceed 8, the bucket transforms into a Red-Black Tree. ConcurrentHashMap uses bucket locking.")
                .build(),

            KnowledgeDocument.builder()
                .id(3L)
                .title("Spring Core: IoC Container & Bean Lifecycle")
                .category("Spring Boot")
                .dayNumber(14)
                .content("The Spring IoC container manages bean lifecycle: Instantiation -> Populate Properties -> BeanPostProcessor -> @PostConstruct.")
                .build()
        );
    }

    @Test
    @DisplayName("Should return empty list when query is blank or null")
    void shouldReturnEmptyForBlankQuery() {
        assertTrue(searchService.search("").isEmpty());
        assertTrue(searchService.search("   ").isEmpty());
        assertTrue(searchService.search(null).isEmpty());
    }

    @Test
    @DisplayName("Should find document by title match and generate correct citation")
    void shouldFindDocumentByTitleMatch() {
        when(knowledgeRepository.findAll()).thenReturn(sampleCurriculum);

        List<KnowledgeSearchResultDto> results = searchService.search("HashMap");

        assertFalse(results.isEmpty());
        assertEquals("HashMap Internal Implementation & Collision Handling", results.get(0).getTitle());
        assertTrue(results.get(0).getCitationTag().contains("Day 3: HashMap"));
        assertTrue(results.get(0).getRelevanceScore() > 0);
        assertNotNull(results.get(0).getHighlightSnippet());
    }

    @Test
    @DisplayName("Should match content terms and rank higher scoring documents first")
    void shouldRankHigherScoringDocumentsFirst() {
        when(knowledgeRepository.findAll()).thenReturn(sampleCurriculum);

        List<KnowledgeSearchResultDto> results = searchService.search("Garbage Collection Heap");

        assertFalse(results.isEmpty());
        assertEquals(1L, results.get(0).getId());
        assertTrue(results.get(0).getHighlightSnippet().toLowerCase().contains("heap") ||
                   results.get(0).getHighlightSnippet().toLowerCase().contains("jvm"));
    }
}
