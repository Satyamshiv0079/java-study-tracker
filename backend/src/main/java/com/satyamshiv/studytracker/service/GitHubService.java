package com.satyamshiv.studytracker.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class GitHubService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${github.token:${GITHUB_TOKEN:}}")
    private String githubToken;

    // In-memory cache with 15-minute TTL to respect GitHub rate limits
    private final Map<String, CachedGitHubData> cache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_SECONDS = 900; // 15 minutes

    public GitHubSummaryResponse getRepositorySummary(String username) {
        String safeUsername = (username == null || username.isBlank()) ? "Satyamshiv0079" : username.trim();

        // 1. Check cache first
        CachedGitHubData cached = cache.get(safeUsername.toLowerCase());
        if (cached != null && Instant.now().isBefore(cached.getExpiresAt())) {
            log.debug("Serving cached GitHub data for {}", safeUsername);
            return cached.getData();
        }

        // 2. Fetch live from GitHub API
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "CodeMentor-Spring-Boot-Backend");
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            if (githubToken != null && !githubToken.isBlank()) {
                headers.setBearerAuth(githubToken);
            }

            HttpEntity<String> entity = new HttpEntity<>(headers);
            String url = "https://api.github.com/users/" + safeUsername + "/repos?sort=updated&per_page=10";

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            List<?> repos = response.getBody();

            Set<String> languages = new LinkedHashSet<>();
            int count = 0;

            if (repos != null) {
                count = repos.size();
                for (Object item : repos) {
                    if (item instanceof Map) {
                        Map<?, ?> repoMap = (Map<?, ?>) item;
                        Object lang = repoMap.get("language");
                        if (lang instanceof String && !((String) lang).isBlank()) {
                            languages.add((String) lang);
                        }
                    }
                }
            }

            if (languages.isEmpty()) {
                languages.add("Java");
            }

            GitHubSummaryResponse summary = GitHubSummaryResponse.builder()
                    .username(safeUsername)
                    .primaryLanguages(new ArrayList<>(languages))
                    .repoCount(count)
                    .studyCorrelation("Live query to GitHub confirmed " + count + " repositories across " + languages + ".")
                    .isLiveApi(true)
                    .cachedAt(Instant.now().toString())
                    .build();

            // Store in cache
            cache.put(safeUsername.toLowerCase(), new CachedGitHubData(summary, Instant.now().plusSeconds(CACHE_TTL_SECONDS)));
            return summary;

        } catch (HttpClientErrorException.Forbidden | HttpClientErrorException.TooManyRequests e) {
            log.warn("GitHub API rate limit reached for {}: {}", safeUsername, e.getMessage());

            // If we have any expired cached data, serve it with clear staleness indicator
            if (cached != null) {
                GitHubSummaryResponse stale = cached.getData();
                stale.setStudyCorrelation("GitHub API rate-limited. Serving cached repository data from " + stale.getCachedAt() + ".");
                stale.setLiveApi(false);
                return stale;
            }

            // DO NOT fabricate fake data. Throw explicit 429/503 error
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "GitHub API rate limit exceeded (60 req/hr for unauthenticated IP). Please configure GITHUB_TOKEN or retry in a few minutes."
            );

        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "GitHub user '" + safeUsername + "' not found.");
        } catch (Exception e) {
            log.error("Failed to query GitHub API for {}: {}", safeUsername, e.getMessage());

            if (cached != null) {
                return cached.getData();
            }

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Unable to reach GitHub API: " + e.getMessage()
            );
        }
    }

    @Data
    @AllArgsConstructor
    private static class CachedGitHubData {
        private GitHubSummaryResponse data;
        private Instant expiresAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GitHubSummaryResponse {
        private String username;
        private List<String> primaryLanguages;
        private int repoCount;
        private String studyCorrelation;
        private boolean isLiveApi;
        private String cachedAt;
    }
}
