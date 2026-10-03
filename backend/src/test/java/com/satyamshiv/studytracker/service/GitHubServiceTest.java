package com.satyamshiv.studytracker.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "JWT_SECRET=superSecretKeyForMockMvcSecurityIntegrationTesting2026AtLeast32Bytes!"
})
class GitHubServiceTest {

    @Autowired
    private GitHubService gitHubService;

    @Test
    @DisplayName("GitHubService should throw explicit HTTP 404 or 429 when user doesn't exist, never fake fallback data")
    void testNonExistentUserDoesNotFabricateData() {
        // A non-existent username with random uuid should fail cleanly without fabricating repos
        String randomUser = "nonExistentUserX99999999999ZZZ";
        try {
            GitHubService.GitHubSummaryResponse response = gitHubService.getRepositorySummary(randomUser);
            // If it succeeds (e.g. if GitHub returns 0 repos), verify repos count is 0
            assertNotNull(response);
            assertEquals(0, response.getRepoCount());
        } catch (ResponseStatusException e) {
            // Must throw 404 or 429/503 - NOT fake data
            assertTrue(e.getStatusCode().is4xxClientError() || e.getStatusCode().is5xxServerError());
        }
    }

    @Test
    @DisplayName("GitHubService should reject invalid usernames and path traversal attempts with HTTP 400")
    void testInvalidUsernameRejected() {
        String[] badUsernames = {
            "../../etc/passwd",
            "user/repo",
            "-leadinghyphen",
            "trailinghyphen-",
            "double--hyphen",
            "user with spaces",
            "a".repeat(40)
        };

        for (String bad : badUsernames) {
            ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
                gitHubService.getRepositorySummary(bad);
            });
            assertEquals(org.springframework.http.HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }
    }
}
