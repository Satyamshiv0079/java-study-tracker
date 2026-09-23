package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayProgressDto {
    private Long id;
    private int dayNumber;
    private boolean completed;
    private Long userId;
}
