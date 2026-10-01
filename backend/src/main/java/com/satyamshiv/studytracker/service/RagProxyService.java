package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.RagQueryDto;
import com.satyamshiv.studytracker.dto.RagResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class RagProxyService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${rag.service.url:http://localhost:8000}")
    private String ragServiceUrl;

    public Map<String, Object> checkHealth() {
        try {
            String url = ragServiceUrl + "/health";
            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            return resp.getBody();
        } catch (ResourceAccessException e) {
            log.warn("RAG Service unavailable at {}: {}", ragServiceUrl, e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("status", "degraded");
            fallback.put("message", "Python RAG microservice is offline or unreachable at " + ragServiceUrl);
            return fallback;
        }
    }

    public Map<String, Object> uploadDocument(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required and cannot be empty");
        }

        try {
            String url = ragServiceUrl + "/documents/upload";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.txt";
                }
            };

            body.add("file", fileResource);
            body.add("user_id", String.valueOf(userId));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "RAG microservice error: " + e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG service offline: " + e.getMessage());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read uploaded file: " + e.getMessage());
        }
    }

    public Map<String, Object> listDocuments(Long userId) {
        try {
            String url = ragServiceUrl + "/documents?user_id=" + userId;
            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            return resp.getBody();
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG microservice offline");
        }
    }

    public Map<String, Object> deleteDocument(Long userId, String documentId) {
        try {
            String url = ragServiceUrl + "/documents/" + documentId + "?user_id=" + userId;
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.DELETE, null, Map.class);
            return resp.getBody();
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG microservice offline");
        }
    }

    public RagResponseDto queryRag(Long userId, RagQueryDto queryDto) {
        try {
            String url = ragServiceUrl + "/rag/query";

            Map<String, Object> payload = new HashMap<>();
            payload.put("question", queryDto.getQuestion());
            payload.put("user_id", String.valueOf(userId));
            payload.put("top_k", queryDto.getTopK() != null ? queryDto.getTopK() : 4);
            payload.put("debug_mode", Boolean.TRUE.equals(queryDto.getDebugMode()));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
            ResponseEntity<RagResponseDto> response = restTemplate.postForEntity(url, requestEntity, RagResponseDto.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG microservice is currently unreachable.");
        }
    }

    public Map<String, Object> debugQuery(Long userId, String question) {
        try {
            String url = ragServiceUrl + "/rag/debug?user_id=" + userId + "&question=" + question;
            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            return resp.getBody();
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG microservice offline");
        }
    }

    public Map<String, Object> evaluate(Long userId, Integer topK) {
        try {
            int k = (topK != null && topK > 0) ? topK : 4;
            String url = ragServiceUrl + "/rag/evaluate?user_id=" + userId + "&top_k=" + k;
            ResponseEntity<Map> resp = restTemplate.postForEntity(url, null, Map.class);
            return resp.getBody();
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "RAG microservice offline");
        }
    }
}
