package com.example.demo.service;

import com.example.demo.model.DayProgress;
import com.example.demo.model.User;
import com.example.demo.repository.DayProgressRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DayProgressService {

    private final DayProgressRepository progressRepository;
    private final UserRepository userRepository;

    public List<DayProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    public DayProgress toggleDay(Long userId, int dayNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DayProgress progress = progressRepository.findByUserIdAndDayNumber(userId, dayNumber)
                .orElse(DayProgress.builder()
                        .user(user)
                        .dayNumber(dayNumber)
                        .completed(false)
                        .build());

        progress.setCompleted(!progress.isCompleted());
        return progressRepository.save(progress);
    }
}
