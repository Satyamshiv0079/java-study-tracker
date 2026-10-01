package com.satyamshiv.studytracker.repository;

import com.satyamshiv.studytracker.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeDocumentRepository extends JpaRepository<KnowledgeDocument, Long> {
    List<KnowledgeDocument> findByCategory(String category);
    List<KnowledgeDocument> findByDayNumber(Integer dayNumber);
}
