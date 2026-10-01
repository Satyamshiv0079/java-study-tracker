package com.satyamshiv.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntryDto {
    private int rank;
    private Long userId;
    private String username;
    private int daysCompleted;
    private int dsaSolved;
    private double studyHours;
    private String badge;
    private boolean isCurrentUser;
}
