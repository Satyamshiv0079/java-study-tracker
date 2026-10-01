package com.satyamshiv.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VivaAttemptDto {
    private Long id;
    private String category;
    private String question;
    private String userAnswer;
    private int score;
    private boolean passed;
    private String feedback;
    private LocalDateTime attemptedAt;
}
