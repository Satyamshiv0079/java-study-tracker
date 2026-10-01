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
public class RecordVivaRequest {

    private String category;

    @NotBlank(message = "Question text is required")
    private String question;

    private String userAnswer;

    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 10, message = "Score cannot exceed 10")
    private int score;

    private String feedback;
}
