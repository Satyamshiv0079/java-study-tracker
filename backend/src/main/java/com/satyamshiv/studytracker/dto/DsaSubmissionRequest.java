package com.satyamshiv.studytracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DsaSubmissionRequest {

    @Min(1)
    @Max(45)
    private int dayNumber;

    private String problemTitle;
    private String code;
    private String language;
    private boolean completed;
    private String timeComplexity;
    private String spaceComplexity;
}
