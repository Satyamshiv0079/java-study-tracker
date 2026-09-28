package com.example.demo.repository;

import com.example.demo.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserIdOrderByCompletedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.user.id = :userId")
    Long getTotalStudyMinutes(@Param("userId") Long userId);

    @Query("SELECT s FROM StudySession s WHERE s.user.id = :userId AND s.completedAt >= :since ORDER BY s.completedAt ASC")
    List<StudySession> findRecentSessions(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    long countByUserId(Long userId);
}
