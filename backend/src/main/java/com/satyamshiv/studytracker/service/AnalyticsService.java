package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.AnalyticsOverviewDto;
import com.satyamshiv.studytracker.model.StudySession;
import com.satyamshiv.studytracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final DayProgressRepository dayProgressRepository;
    private final DsaSubmissionRepository dsaRepository;
    private final StudySessionRepository studySessionRepository;
    private final VivaAttemptRepository vivaRepository;
    private final ProjectMilestoneRepository projectRepository;

    public AnalyticsOverviewDto calculateUserAnalytics(Long userId) {
        // 1. Curriculum days
        var dayList = dayProgressRepository.findByUserId(userId);
        int completedDays = (int) dayList.stream().filter(d -> d.isCompleted()).count();
        double dayPct = Math.round((completedDays / 45.0) * 1000.0) / 10.0;

        // 2. DSA challenges
        long dsaCount = dsaRepository.countByUserIdAndCompletedTrue(userId);
        double dsaPct = Math.round((dsaCount / 45.0) * 1000.0) / 10.0;

        // 3. Study hours & sessions
        Long totalMins = studySessionRepository.getTotalStudyMinutes(userId);
        long minutes = totalMins != null ? totalMins : 0L;
        double hours = Math.round((minutes / 60.0) * 10.0) / 10.0;
        int sessionCount = (int) studySessionRepository.countByUserId(userId);

        // 4. Mock viva
        long vivaTotal = vivaRepository.countByUserId(userId);
        long vivaPassed = vivaRepository.countByUserIdAndPassedTrue(userId);
        Double avg = vivaRepository.getAverageScore(userId);
        double vivaAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        // 5. Capstone project milestones
        long milestonesDone = projectRepository.countByUserIdAndCompletedTrue(userId);
        double projPct = Math.round((milestonesDone / 8.0) * 1000.0) / 10.0;

        // 6. Placement Readiness Composite Score (0 - 100)
        // 30% Theory + 25% DSA + 25% Capstone Projects + 20% Mock Interview Performance
        double vivaFactor = vivaTotal > 0 ? ((double) vivaPassed / vivaTotal) * 20.0 : 0.0;
        int readiness = (int) Math.min(100, Math.round(
                (completedDays / 45.0) * 30.0 +
                (dsaCount / 45.0) * 25.0 +
                (milestonesDone / 8.0) * 25.0 +
                vivaFactor
        ));

        // 7. Last 7 Days Study Trend from real database records
        LocalDateTime sevenDaysAgo = LocalDate.now().minusDays(6).atStartOfDay();
        List<StudySession> recentSessions = studySessionRepository.findRecentSessions(userId, sevenDaysAgo);

        Map<LocalDate, Integer> dailyMinutesMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dailyMinutesMap.put(LocalDate.now().minusDays(i), 0);
        }

        for (StudySession s : recentSessions) {
            LocalDate sessionDate = s.getCompletedAt().toLocalDate();
            if (dailyMinutesMap.containsKey(sessionDate)) {
                dailyMinutesMap.put(sessionDate, dailyMinutesMap.get(sessionDate) + s.getDurationMinutes());
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        List<AnalyticsOverviewDto.DailyStudyLogDto> dailyLogs = new ArrayList<>();
        for (Map.Entry<LocalDate, Integer> entry : dailyMinutesMap.entrySet()) {
            dailyLogs.add(AnalyticsOverviewDto.DailyStudyLogDto.builder()
                    .date(entry.getKey().format(formatter))
                    .minutes(entry.getValue())
                    .hours(Math.round((entry.getValue() / 60.0) * 10.0) / 10.0)
                    .build());
        }

        // 8. DSA Category Breakdown
        Map<String, Integer> categoryMap = new HashMap<>();
        categoryMap.put("Core Java & Syntax", 0);
        categoryMap.put("OOP & Design", 0);
        categoryMap.put("Collections & Generics", 0);
        categoryMap.put("Concurrency & Threads", 0);
        categoryMap.put("Spring Boot & REST", 0);

        var dsaList = dsaRepository.findByUserIdOrderByDayNumberAsc(userId);
        for (var sub : dsaList) {
            if (sub.isCompleted()) {
                int day = sub.getDayNumber();
                if (day <= 10) categoryMap.put("Core Java & Syntax", categoryMap.get("Core Java & Syntax") + 1);
                else if (day <= 20) categoryMap.put("OOP & Design", categoryMap.get("OOP & Design") + 1);
                else if (day <= 28) categoryMap.put("Collections & Generics", categoryMap.get("Collections & Generics") + 1);
                else if (day <= 35) categoryMap.put("Concurrency & Threads", categoryMap.get("Concurrency & Threads") + 1);
                else categoryMap.put("Spring Boot & REST", categoryMap.get("Spring Boot & REST") + 1);
            }
        }

        return AnalyticsOverviewDto.builder()
                .completedDaysCount(completedDays)
                .totalCurriculumDays(45)
                .curriculumCompletionPercentage(dayPct)
                .dsaSolvedCount((int) dsaCount)
                .totalDsaChallenges(45)
                .dsaCompletionPercentage(dsaPct)
                .totalStudyHours(hours)
                .totalStudyMinutes(minutes)
                .totalStudySessions(sessionCount)
                .vivaTotalAttempts(vivaTotal)
                .vivaPassedAttempts(vivaPassed)
                .vivaAverageScore(vivaAvg)
                .projectMilestonesDone((int) milestonesDone)
                .totalProjectMilestones(8)
                .projectCompletionPercentage(projPct)
                .placementReadinessScore(readiness)
                .last7DaysStudy(dailyLogs)
                .dsaCategoryBreakdown(categoryMap)
                .build();
    }
}
