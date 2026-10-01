package com.satyamshiv.studytracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagSourceCitationDto {
    private String document;

    @JsonProperty("document_id")
    private String documentId;

    private Integer page;

    @JsonProperty("chunk_index")
    private Integer chunkIndex;

    private Double score;
    private String snippet;
}
