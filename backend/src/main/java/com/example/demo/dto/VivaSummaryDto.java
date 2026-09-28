package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VivaSummaryDto {
    private long totalAttempts;
    private long passedAttempts;
    private double averageScore;
    private double passRate;
}
