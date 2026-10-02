package com.satyamshiv.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCareerRequest {
    private String type;         // "resume", "linkedin", "code_review"
    private String text;
    private String fileData;     // Base64-encoded PDF/text file
    private String mimeType;     // e.g. "application/pdf"
    private String url;          // URL to analyze
    private String targetRole;   // Target job role
}
