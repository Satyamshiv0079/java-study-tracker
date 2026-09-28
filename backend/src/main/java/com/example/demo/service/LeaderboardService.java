package com.example.demo.service;

import com.example.demo.dto.LeaderboardEntryDto;
import com.example.demo.model.User;
import com.example.demo.repository.DayProgressRepository;
import com.example.demo.repository.DsaSubmissionRepository;
import com.example.demo.repository.StudySessionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final DayProgressRepository dayProgressRepository;
    private final DsaSubmissionRepository dsaRepository;
    private final StudySessionRepository studySessionRepository;

    public List<LeaderboardEntryDto> getLeaderboard(Long currentUserId) {
        List<User> users = userRepository.findAll();
        List<LeaderboardEntryDto> entries = new ArrayList<>();

        for (User user : users) {
            int daysDone = (int) dayProgressRepository.findByUserId(user.getId()).stream()
                    .filter(d -> d.isCompleted())
                    .count();
            int dsaDone = (int) dsaRepository.countByUserIdAndCompletedTrue(user.getId());
            Long mins = studySessionRepository.getTotalStudyMinutes(user.getId());
            double hours = mins != null ? Math.round((mins / 60.0) * 10.0) / 10.0 : 0.0;

            String badge = determineBadge(daysDone, dsaDone);

            entries.add(LeaderboardEntryDto.builder()
                    .userId(user.getId())
                    .username(user.getUsername())
                    .daysCompleted(daysDone)
                    .dsaSolved(dsaDone)
                    .studyHours(hours)
                    .badge(badge)
                    .isCurrentUser(currentUserId != null && currentUserId.equals(user.getId()))
                    .build());
        }

        // Sort descending: days completed first, then DSA solved, then study hours
        entries.sort(Comparator
                .comparingInt(LeaderboardEntryDto::getDaysCompleted)
                .thenComparingInt(LeaderboardEntryDto::getDsaSolved)
                .thenComparingDouble(LeaderboardEntryDto::getStudyHours)
                .reversed());

        // Assign ranks
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        return entries;
    }

    private String determineBadge(int daysDone, int dsaDone) {
        if (daysDone >= 40 && dsaDone >= 35) return "Java Master";
        if (daysDone >= 30) return "System Architect";
        if (daysDone >= 20) return "Spring Developer";
        if (daysDone >= 10) return "Java Specialist";
        return "Backend Aspirant";
    }
}
