package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsOverviewDto {
    private int completedDaysCount;
    private int totalCurriculumDays; // 45
    private double curriculumCompletionPercentage;

    private int dsaSolvedCount;
    private int totalDsaChallenges; // 45
    private double dsaCompletionPercentage;

    private double totalStudyHours;
    private long totalStudyMinutes;
    private int totalStudySessions;

    private long vivaTotalAttempts;
    private long vivaPassedAttempts;
    private double vivaAverageScore;

    private int projectMilestonesDone;
    private int totalProjectMilestones; // 8
    private double projectCompletionPercentage;

    private int placementReadinessScore; // 0 - 100

    private List<DailyStudyLogDto> last7DaysStudy;
    private Map<String, Integer> dsaCategoryBreakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyStudyLogDto {
        private String date; // "YYYY-MM-DD"
        private int minutes;
        private double hours;
    }
}
