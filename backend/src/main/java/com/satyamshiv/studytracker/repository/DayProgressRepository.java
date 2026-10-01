package com.satyamshiv.studytracker.repository;

import com.satyamshiv.studytracker.model.DayProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DayProgressRepository extends JpaRepository<DayProgress, Long> {
    List<DayProgress> findByUserId(Long userId);
    Optional<DayProgress> findByUserIdAndDayNumber(Long userId, int dayNumber);
}
