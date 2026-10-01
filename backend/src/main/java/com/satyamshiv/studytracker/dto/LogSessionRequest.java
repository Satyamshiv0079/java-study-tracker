package com.satyamshiv.studytracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogSessionRequest {

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 720, message = "Duration cannot exceed 12 hours")
    private int durationMinutes;

    @NotBlank(message = "Session mode is required (e.g., pomodoro, study, break)")
    private String mode;
}
