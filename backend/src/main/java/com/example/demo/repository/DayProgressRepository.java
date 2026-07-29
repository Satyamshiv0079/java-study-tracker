package com.example.demo.repository;

import com.example.demo.model.DayProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DayProgressRepository extends JpaRepository<DayProgress, Long> {
    List<DayProgress> findByUserId(Long userId);
    Optional<DayProgress> findByUserIdAndDayNumber(Long userId, int dayNumber);
}
