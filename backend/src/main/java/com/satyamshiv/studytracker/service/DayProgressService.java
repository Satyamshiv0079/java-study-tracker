package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.exception.UserNotFoundException;
import com.satyamshiv.studytracker.model.DayProgress;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.DayProgressRepository;
import com.satyamshiv.studytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DayProgressService {

    private final DayProgressRepository progressRepository;
    private final UserRepository userRepository;

    public List<DayProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    @Transactional
    public DayProgress toggleDay(Long userId, int dayNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

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
