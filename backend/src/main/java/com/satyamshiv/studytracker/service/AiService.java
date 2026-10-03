package com.satyamshiv.studytracker.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satyamshiv.studytracker.dto.AiCareerRequest;
import com.satyamshiv.studytracker.dto.AiChatRequest;
import com.satyamshiv.studytracker.exception.BusinessRuleException;
import com.satyamshiv.studytracker.model.DayProgress;
import com.satyamshiv.studytracker.repository.DayProgressRepository;
import com.satyamshiv.studytracker.repository.StudySessionRepository;
import com.satyamshiv.studytracker.security.SsrfProtectionValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SsrfProtectionValidator ssrfProtectionValidator;
    private final DayProgressRepository dayProgressRepository;
    private final StudySessionRepository studySessionRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    public AiService(SsrfProtectionValidator ssrfProtectionValidator,
                     DayProgressRepository dayProgressRepository,
                     StudySessionRepository studySessionRepository) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(60_000);
        this.restTemplate = new RestTemplate(factory);
        this.ssrfProtectionValidator = ssrfProtectionValidator;
        this.dayProgressRepository = dayProgressRepository;
        this.studySessionRepository = studySessionRepository;
    }

    /**
     * Executes interactive mentor chat via Google Gemini LLM for authenticated user.
     * Computes verified study telemetry from database to prevent client spoofing.
     */
    public Map<String, Object> chat(Long userId, AiChatRequest request) {
        ensureApiKeyConfigured();

        // Authoritative server-side progress lookup (ignores client-supplied userState)
        int completedDays = 0;
        try {
            completedDays = (int) dayProgressRepository.findByUserId(userId).stream()
                    .filter(DayProgress::isCompleted)
                    .count();
        } catch (Exception e) {
            log.debug("Telemetry lookup error for user {}: {}", userId, e.getMessage());
        }

        Long totalMins = null;
        try {
            totalMins = studySessionRepository.getTotalStudyMinutes(userId);
        } catch (Exception e) {
            log.debug("Study minutes lookup error for user {}: {}", userId, e.getMessage());
        }
        double studyHours = totalMins != null ? Math.round((totalMins / 60.0) * 10.0) / 10.0 : 0.0;

        String context = request.getActiveDayTitle() != null ? request.getActiveDayTitle() : "General";
        String promptContext = String.format(
                "You are a direct, technically rigorous Software Engineering mentor helping a student prepare for Backend Java-Spring interviews. " +
                "Do not use overly fluffy language. Keep explanations extremely concise and code-focused. " +
                "Current syllabus topic: %s. Verified student progress: %d/45 days completed, %.1f study hours logged.",
                context, completedDays, studyHours
        );

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
        );

        Map<String, Object> systemInstruction = Map.of(
                "parts", Map.of("text", promptContext)
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("system_instruction", systemInstruction);
        requestBody.put("contents", request.getHistoryContent() != null ? request.getHistoryContent() : List.of());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return response.getBody();
        } catch (HttpStatusCodeException ex) {
            log.error("Gemini Chat API returned HTTP {}: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new BusinessRuleException("Gemini API error: " + ex.getStatusCode() + " - " + ex.getStatusText());
        } catch (Exception ex) {
            log.error("Failed to call Gemini Chat API: {}", ex.getMessage());
            throw new BusinessRuleException("AI service currently unavailable: " + ex.getMessage());
        }
    }

    /**
     * Evaluates Resumes, LinkedIn profiles, or Code snippets against target engineering criteria for authenticated user.
     * Uses SSRF-safe URL fetching when external profile/portfolio links are provided.
     */
    public Map<String, Object> analyzeCareer(Long userId, AiCareerRequest request) {
        ensureApiKeyConfigured();

        String fetchedUrlContent = "";
        if (request.getUrl() != null && !request.getUrl().isBlank()) {
            String trimmedUrl = request.getUrl().trim();
            if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
                try {
                    fetchedUrlContent = ssrfProtectionValidator.fetchSafeContent(trimmedUrl);
                } catch (IllegalArgumentException e) {
                    throw new BusinessRuleException("Invalid or blocked URL: " + e.getMessage());
                } catch (Exception e) {
                    log.warn("URL Fetch Warning for user {} ({}) : {}", userId, trimmedUrl, e.getMessage());
                }
            }
        }

        List<String> contentParts = new ArrayList<>();
        if (request.getText() != null && !request.getText().isBlank()) {
            contentParts.add(request.getText().trim());
        }
        if (!fetchedUrlContent.isBlank()) {
            contentParts.add("Extracted Web Content:\n" + fetchedUrlContent);
        }

        String contentSourceText = String.join("\n\n", contentParts);

        if (contentSourceText.isBlank() && (request.getFileData() == null || request.getFileData().isBlank())) {
            throw new BusinessRuleException("Please upload a PDF file, paste text, or provide a URL to analyze.");
        }

        String targetRole = (request.getTargetRole() != null && !request.getTargetRole().isBlank())
                ? request.getTargetRole()
                : "Java Backend Engineer";

        String systemPrompt;
        if ("resume".equalsIgnoreCase(request.getType())) {
            systemPrompt = "You are a brutally honest, senior Tech Recruiter & VP of Engineering at a top tech company evaluating candidates for Java / Spring Boot Software Engineering roles. Do NOT sugarcoat your evaluation. Give a realistic, uninflated ATS compatibility score (0-100%). Most junior/student resumes deserve 30%-65% because they lack metrics, architecture depth, or production tech stack details (e.g. Spring Security, Docker, PostgreSQL, JUnit, Kafka).\n\n" +
                    "Evaluate the candidate's resume/CV against the target role: \"" + targetRole + "\".\n\n" +
                    "Return ONLY a single valid JSON object with the following schema:\n" +
                    "{\n" +
                    "  \"atsScore\": (uninflated integer between 0 and 100),\n" +
                    "  \"summary\": \"(2 sentence brutally honest technical assessment of why a recruiter would accept or reject this resume in a 6-second scan)\",\n" +
                    "  \"missingKeywords\": [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\", \"keyword5\"],\n" +
                    "  \"bulletUpgrades\": [\n" +
                    "    {\n" +
                    "      \"original\": \"(weak, generic, or non-quantified bullet point from text or PDF)\",\n" +
                    "      \"improved\": \"(quantifiable, high-impact rewrite using strong engineering verbs & tech stack)\",\n" +
                    "      \"reason\": \"(brutally honest technical explanation of why this rewrite fixes a flaw)\"\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"syllabusGaps\": [\n" +
                    "    {\n" +
                    "      \"skill\": \"(missing technical skill needed for placement)\",\n" +
                    "      \"recommendedDay\": \"(e.g. Day 33: Spring Security & JWT Authentication)\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +
                    "Candidate Text / URL Content:\n" +
                    (contentSourceText.isBlank() ? "Evaluate the attached PDF document." : contentSourceText);
        } else if ("linkedin".equalsIgnoreCase(request.getType())) {
            systemPrompt = "You are a brutally honest Tech Headhunter & LinkedIn Branding Director specializing in Java / Spring Boot Backend placements. Do NOT sugarcoat. Evaluate why a recruiter scrolling through 100 profiles would pass over or click on this profile for the target role: \"" + targetRole + "\".\n\n" +
                    "Return ONLY a single valid JSON object with the following schema:\n" +
                    "{\n" +
                    "  \"profileScore\": (uninflated integer between 0 and 100),\n" +
                    "  \"feedback\": \"(2 sentence brutally candid critique explaining why recruiters would filter out or contact this candidate)\",\n" +
                    "  \"headlines\": [\n" +
                    "    \"(Punchy, Recruiter-Magnet Headline Option 1)\",\n" +
                    "    \"(Punchy, Recruiter-Magnet Headline Option 2)\",\n" +
                    "    \"(Punchy, Recruiter-Magnet Headline Option 3)\"\n" +
                    "  ],\n" +
                    "  \"missingRecruiterKeywords\": [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\"],\n" +
                    "  \"outreachTemplate\": \"(A direct, non-cringe 2-sentence cold outreach note to send to Engineering Managers or Recruiters)\"\n" +
                    "}\n\n" +
                    "Candidate LinkedIn / Profile Content:\n" +
                    (contentSourceText.isBlank() ? "Evaluate the attached document / URL." : contentSourceText);
        } else {
            // General or code review prompt
            systemPrompt = contentSourceText;
        }

        List<Map<String, Object>> parts = new ArrayList<>();

        if (request.getFileData() != null && !request.getFileData().isBlank()) {
            String cleanBase64 = request.getFileData().contains(",")
                    ? request.getFileData().split(",")[1]
                    : request.getFileData();
            String mime = (request.getMimeType() != null && !request.getMimeType().isBlank())
                    ? request.getMimeType()
                    : "application/pdf";
            parts.add(Map.of(
                    "inline_data", Map.of(
                            "mime_type", mime,
                            "data", cleanBase64
                    )
            ));
        }

        parts.add(Map.of("text", systemPrompt));

        Map<String, Object> requestBody = Map.of(
                "generationConfig", Map.of("response_mime_type", "application/json"),
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", parts
                        )
                )
        );

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map responseBody = response.getBody();
            if (responseBody == null) {
                throw new BusinessRuleException("Empty response received from AI model.");
            }

            // Extract candidates[0].content.parts[0].text
            List candidates = (List) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new BusinessRuleException("No content generated by AI model.");
            }

            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List resParts = (List) content.get("parts");
            Map firstPart = (Map) resParts.get(0);
            String rawJsonText = (String) firstPart.get("text");

            return objectMapper.readValue(rawJsonText, Map.class);
        } catch (HttpStatusCodeException ex) {
            log.error("Gemini Career API returned HTTP {}: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new BusinessRuleException("Gemini API error: " + ex.getStatusCode() + " - " + ex.getStatusText());
        } catch (BusinessRuleException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to analyze career prompt: {}", ex.getMessage());
            throw new BusinessRuleException("AI Career evaluation failed: " + ex.getMessage());
        }
    }

    private void ensureApiKeyConfigured() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new BusinessRuleException("GEMINI_API_KEY is not configured on the server. Please configure it in environment variables.");
        }
    }
}
