package com.example.demo.service;

import com.example.demo.dto.RecordVivaRequest;
import com.example.demo.dto.VivaAttemptDto;
import com.example.demo.dto.VivaSummaryDto;
import com.example.demo.model.User;
import com.example.demo.model.VivaAttempt;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VivaAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VivaAttemptService {

    private final VivaAttemptRepository vivaRepository;
    private final UserRepository userRepository;

    public List<VivaAttemptDto> getUserAttempts(Long userId) {
        return vivaRepository.findByUserIdOrderByAttemptedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VivaAttemptDto recordAttempt(Long userId, RecordVivaRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean passed = req.getScore() >= 7;

        VivaAttempt attempt = VivaAttempt.builder()
                .user(user)
                .category(req.getCategory())
                .question(req.getQuestion())
                .userAnswer(req.getUserAnswer())
                .score(req.getScore())
                .passed(passed)
                .feedback(req.getFeedback())
                .attemptedAt(LocalDateTime.now())
                .build();

        return toDto(vivaRepository.save(attempt));
    }

    public VivaSummaryDto getSummary(Long userId) {
        long total = vivaRepository.countByUserId(userId);
        long passed = vivaRepository.countByUserIdAndPassedTrue(userId);
        Double avg = vivaRepository.getAverageScore(userId);
        double avgScore = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
        double passRate = total > 0 ? Math.round(((double) passed / total) * 100.0) : 0.0;

        return VivaSummaryDto.builder()
                .totalAttempts(total)
                .passedAttempts(passed)
                .averageScore(avgScore)
                .passRate(passRate)
                .build();
    }

    public long getPassedCount(Long userId) {
        return vivaRepository.countByUserIdAndPassedTrue(userId);
    }

    public long getTotalCount(Long userId) {
        return vivaRepository.countByUserId(userId);
    }

    private VivaAttemptDto toDto(VivaAttempt v) {
        return VivaAttemptDto.builder()
                .id(v.getId())
                .category(v.getCategory())
                .question(v.getQuestion())
                .userAnswer(v.getUserAnswer())
                .score(v.getScore())
                .passed(v.isPassed())
                .feedback(v.getFeedback())
                .attemptedAt(v.getAttemptedAt())
                .build();
    }
}
