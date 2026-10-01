package com.satyamshiv.studytracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagQueryDto {
    @NotBlank(message = "Question is required")
    private String question;
    private Integer topK;
    private Boolean debugMode;
}
