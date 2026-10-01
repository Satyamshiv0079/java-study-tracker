package com.satyamshiv.studytracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class RagResponseDto {
    private String answer;
    private List<RagSourceCitationDto> sources;

    @JsonProperty("retrieved_chunks")
    private Integer retrievedChunks;

    private Boolean grounded;

    @JsonProperty("debug_info")
    private Map<String, Object> debugInfo;
}
