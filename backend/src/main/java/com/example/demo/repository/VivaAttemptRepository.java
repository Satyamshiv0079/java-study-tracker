package com.example.demo.repository;

import com.example.demo.model.VivaAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VivaAttemptRepository extends JpaRepository<VivaAttempt, Long> {
    List<VivaAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndPassedTrue(Long userId);

    @Query("SELECT COALESCE(AVG(v.score), 0.0) FROM VivaAttempt v WHERE v.user.id = :userId")
    Double getAverageScore(@Param("userId") Long userId);
}
