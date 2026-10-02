package com.satyamshiv.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {
    private String activeDayTitle;
    private Map<String, Object> userState;
    private List<Map<String, Object>> historyContent;
}
