package com.example.demo.repository;

import com.example.demo.model.DsaSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DsaSubmissionRepository extends JpaRepository<DsaSubmission, Long> {
    List<DsaSubmission> findByUserIdOrderByDayNumberAsc(Long userId);
    Optional<DsaSubmission> findByUserIdAndDayNumber(Long userId, int dayNumber);
    long countByUserIdAndCompletedTrue(Long userId);
}
