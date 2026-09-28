package com.example.demo.service;

import com.example.demo.dto.LogSessionRequest;
import com.example.demo.dto.StudySessionDto;
import com.example.demo.model.StudySession;
import com.example.demo.model.User;
import com.example.demo.repository.StudySessionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;

    public List<StudySessionDto> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByCompletedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudySessionDto logSession(Long userId, LogSessionRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudySession session = StudySession.builder()
                .user(user)
                .durationMinutes(req.getDurationMinutes())
                .mode(req.getMode() != null ? req.getMode().toLowerCase() : "study")
                .completedAt(LocalDateTime.now())
                .build();

        return toDto(sessionRepository.save(session));
    }

    public long getTotalStudyMinutes(Long userId) {
        Long minutes = sessionRepository.getTotalStudyMinutes(userId);
        return minutes != null ? minutes : 0L;
    }

    public double getTotalStudyHours(Long userId) {
        return Math.round((getTotalStudyMinutes(userId) / 60.0) * 10.0) / 10.0;
    }

    public int getSessionCount(Long userId) {
        return (int) sessionRepository.countByUserId(userId);
    }

    public List<StudySession> getRecentSessions(Long userId, LocalDateTime since) {
        return sessionRepository.findRecentSessions(userId, since);
    }

    private StudySessionDto toDto(StudySession s) {
        return StudySessionDto.builder()
                .id(s.getId())
                .durationMinutes(s.getDurationMinutes())
                .mode(s.getMode())
                .completedAt(s.getCompletedAt())
                .build();
    }
}
