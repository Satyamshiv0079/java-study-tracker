package com.satyamshiv.studytracker.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitingFilterTest {

    private RateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RateLimitingFilter();
        filter.reset();
    }

    @Test
    @DisplayName("Should allow requests under the auth limit")
    void shouldAllowRequestsUnderLimit() throws Exception {
        for (int i = 0; i < RateLimitingFilter.AUTH_LIMIT; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/users/login");
            request.setRemoteAddr("192.168.1.100");
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain chain = new MockFilterChain();

            filter.doFilterInternal(request, response, chain);
            assertEquals(200, response.getStatus());
        }
    }

    @Test
    @DisplayName("Should block requests exceeding auth limit with 429 and Retry-After header")
    void shouldBlockRequestsExceedingAuthLimit() throws Exception {
        // Exhaust limit
        for (int i = 0; i < RateLimitingFilter.AUTH_LIMIT; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/users/login");
            request.setRemoteAddr("192.168.1.101");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilterInternal(request, response, new MockFilterChain());
        }

        // 11th request should be rejected with 429
        MockHttpServletRequest blockedRequest = new MockHttpServletRequest("POST", "/api/users/login");
        blockedRequest.setRemoteAddr("192.168.1.101");
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        MockFilterChain blockedChain = new MockFilterChain();

        filter.doFilterInternal(blockedRequest, blockedResponse, blockedChain);

        assertEquals(429, blockedResponse.getStatus());
        assertNotNull(blockedResponse.getHeader("Retry-After"));
        assertTrue(blockedResponse.getContentAsString().contains("Too Many Requests"));
    }

    @Test
    @DisplayName("Should allow health and monitoring endpoints without rate limiting")
    void shouldAllowWhitelistedEndpoints() throws Exception {
        for (int i = 0; i < 20; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/health");
            request.setRemoteAddr("192.168.1.102");
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain chain = new MockFilterChain();

            filter.doFilterInternal(request, response, chain);
            assertEquals(200, response.getStatus());
        }
    }

    @Test
    @DisplayName("Should distinguish between different client IPs")
    void shouldDistinguishBetweenDifferentIps() throws Exception {
        // Exhaust IP 1
        for (int i = 0; i < RateLimitingFilter.AUTH_LIMIT; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/users/login");
            request.setRemoteAddr("192.168.1.1");
            filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());
        }

        // IP 2 should still be allowed
        MockHttpServletRequest ip2Request = new MockHttpServletRequest("POST", "/api/users/login");
        ip2Request.setRemoteAddr("192.168.1.2");
        MockHttpServletResponse ip2Response = new MockHttpServletResponse();

        filter.doFilterInternal(ip2Request, ip2Response, new MockFilterChain());
        assertEquals(200, ip2Response.getStatus());
    }

    @Test
    @DisplayName("Should extract client IP from X-Forwarded-For behind reverse proxy")
    void shouldExtractFromXForwardedFor() throws Exception {
        for (int i = 0; i < RateLimitingFilter.AUTH_LIMIT; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/users/login");
            request.addHeader("X-Forwarded-For", "203.0.113.195, 70.41.3.18");
            request.setRemoteAddr("10.0.0.1"); // Render/proxy internal IP
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilterInternal(request, response, new MockFilterChain());
        }

        // Next request from that client IP should be blocked
        MockHttpServletRequest blockedRequest = new MockHttpServletRequest("POST", "/api/users/login");
        blockedRequest.addHeader("X-Forwarded-For", "203.0.113.195, 70.41.3.18");
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();

        filter.doFilterInternal(blockedRequest, blockedResponse, new MockFilterChain());
        assertEquals(429, blockedResponse.getStatus());
    }
}
