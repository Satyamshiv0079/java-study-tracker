package com.example.demo.repository;

import com.example.demo.model.ProjectMilestoneProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestoneProgress, Long> {
    List<ProjectMilestoneProgress> findByUserIdOrderByMilestoneIdAsc(Long userId);
    Optional<ProjectMilestoneProgress> findByUserIdAndMilestoneId(Long userId, int milestoneId);
    long countByUserIdAndCompletedTrue(Long userId);
}
