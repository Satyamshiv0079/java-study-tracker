package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.AnalyticsOverviewDto;
import com.satyamshiv.studytracker.model.DayProgress;
import com.satyamshiv.studytracker.model.DsaSubmission;
import com.satyamshiv.studytracker.model.StudySession;
import com.satyamshiv.studytracker.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private DayProgressRepository dayProgressRepository;

    @Mock
    private DsaSubmissionRepository dsaRepository;

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private VivaAttemptRepository vivaRepository;

    @Mock
    private ProjectMilestoneRepository projectRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    @DisplayName("Should calculate true composite placement readiness and metrics from domain entities")
    void shouldCalculateAccurateAnalytics() {
        Long userId = 1L;

        // 1. Day Progress (15 completed out of 45)
        List<DayProgress> days = List.of(
                DayProgress.builder().dayNumber(1).completed(true).build(),
                DayProgress.builder().dayNumber(2).completed(true).build()
        );
        when(dayProgressRepository.findByUserId(userId)).thenReturn(days);

        // 2. DSA Count
        when(dsaRepository.countByUserIdAndCompletedTrue(userId)).thenReturn(10L);

        // 3. Study Hours
        when(studySessionRepository.getTotalStudyMinutes(userId)).thenReturn(360L); // 6 hours
        when(studySessionRepository.countByUserId(userId)).thenReturn(12L);

        // 4. Viva Attempts
        when(vivaRepository.countByUserId(userId)).thenReturn(5L);
        when(vivaRepository.countByUserIdAndPassedTrue(userId)).thenReturn(4L);
        when(vivaRepository.getAverageScore(userId)).thenReturn(8.2);

        // 5. Milestones
        when(projectRepository.countByUserIdAndCompletedTrue(userId)).thenReturn(4L); // 50%

        // 6. Recent sessions
        StudySession recent = StudySession.builder()
                .durationMinutes(50)
                .mode("pomodoro")
                .completedAt(LocalDateTime.now())
                .build();
        when(studySessionRepository.findRecentSessions(eq(userId), any())).thenReturn(List.of(recent));

        // 7. DSA category breakdown
        List<DsaSubmission> subs = List.of(
                DsaSubmission.builder().dayNumber(5).completed(true).build(),
                DsaSubmission.builder().dayNumber(15).completed(true).build()
        );
        when(dsaRepository.findByUserIdOrderByDayNumberAsc(userId)).thenReturn(subs);

        AnalyticsOverviewDto dto = analyticsService.calculateUserAnalytics(userId);

        assertNotNull(dto);
        assertEquals(2, dto.getCompletedDaysCount());
        assertEquals(10, dto.getDsaSolvedCount());
        assertEquals(6.0, dto.getTotalStudyHours());
        assertEquals(12, dto.getTotalStudySessions());
        assertEquals(5, dto.getVivaTotalAttempts());
        assertEquals(4, dto.getVivaPassedAttempts());
        assertEquals(8.2, dto.getVivaAverageScore());
        assertEquals(4, dto.getProjectMilestonesDone());
        assertTrue(dto.getPlacementReadinessScore() > 0 && dto.getPlacementReadinessScore() <= 100);
        assertEquals(7, dto.getLast7DaysStudy().size());
        assertEquals(1, dto.getDsaCategoryBreakdown().get("Core Java & Syntax"));
        assertEquals(1, dto.getDsaCategoryBreakdown().get("OOP & Design"));
    }
}
