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
public class DsaSubmissionDto {
    private Long id;
    private int dayNumber;
    private String problemTitle;
    private String code;
    private String language;
    private boolean completed;
    private String timeComplexity;
    private String spaceComplexity;
    private LocalDateTime submittedAt;
}
