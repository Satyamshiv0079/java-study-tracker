package com.satyamshiv.studytracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory sliding-window rate limiter filter.
 * Protects public endpoints (like login/register) against brute-force and credential stuffing,
 * and defends general API endpoints against denial-of-service abuse.
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    public static final int AUTH_LIMIT = 10;          // 10 requests per minute for auth
    public static final int GENERAL_LIMIT = 120;       // 120 requests per minute for general API
    public static final long WINDOW_MS = 60_000L;      // 1 minute sliding window

    // IP -> Deque of request timestamps (epoch ms)
    private final Map<String, Deque<Long>> authRequestLog = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> generalRequestLog = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Allow CORS preflight OPTIONS requests unconditionally
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // Whitelisted monitoring and documentation paths
        if (path.startsWith("/api/health") || path.startsWith("/swagger-ui") ||
            path.startsWith("/v3/api-docs") || path.startsWith("/h2-console") ||
            path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = extractClientIp(request);
        long now = System.currentTimeMillis();

        if (isAuthEndpoint(path)) {
            if (!isAllowed(authRequestLog, clientIp, AUTH_LIMIT, now)) {
                log.warn("Rate limit tripped for auth endpoint {} from IP {}", path, clientIp);
                rejectWithRateLimit(response, calculateRetryAfter(authRequestLog, clientIp, now));
                return;
            }
        } else if (path.startsWith("/api/")) {
            if (!isAllowed(generalRequestLog, clientIp, GENERAL_LIMIT, now)) {
                log.warn("Rate limit tripped for general API endpoint {} from IP {}", path, clientIp);
                rejectWithRateLimit(response, calculateRetryAfter(generalRequestLog, clientIp, now));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAuthEndpoint(String path) {
        return path.equals("/api/users/login") || path.equals("/api/users/register");
    }

    private synchronized boolean isAllowed(Map<String, Deque<Long>> logMap, String ip, int maxRequests, long now) {
        Deque<Long> timestamps = logMap.computeIfAbsent(ip, k -> new ArrayDeque<>());

        // Evict timestamps older than the sliding window
        long cutoff = now - WINDOW_MS;
        while (!timestamps.isEmpty() && timestamps.peekFirst() < cutoff) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxRequests) {
            return false;
        }

        timestamps.addLast(now);
        return true;
    }

    private synchronized long calculateRetryAfter(Map<String, Deque<Long>> logMap, String ip, long now) {
        Deque<Long> timestamps = logMap.get(ip);
        if (timestamps == null || timestamps.isEmpty()) {
            return 1L;
        }
        long oldestInWindow = timestamps.peekFirst();
        long waitTimeMs = (oldestInWindow + WINDOW_MS) - now;
        return Math.max(1L, (waitTimeMs + 999) / 1000); // Ceiling in seconds
    }

    private void rejectWithRateLimit(HttpServletResponse response, long retryAfterSeconds) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));

        String json = String.format(
            "{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please wait %d seconds before trying again.\",\"retryAfterSeconds\":%d}",
            retryAfterSeconds, retryAfterSeconds
        );
        response.getWriter().write(json);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            // First IP in list is the original client behind reverse proxies (Render, Cloudflare, AWS ALB)
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }

    // Helper for testing
    public void reset() {
        authRequestLog.clear();
        generalRequestLog.clear();
    }
}
