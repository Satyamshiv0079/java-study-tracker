package com.satyamshiv.studytracker.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;

/**
 * Enterprise SSRF (Server-Side Request Forgery) protection validator and safe web content fetcher.
 * Enforces strict protocol validation, DNS resolution checks, private/internal IP filtering,
 * cloud metadata service blocking, and bounded content retrieval.
 */
@Slf4j
@Component
public class SsrfProtectionValidator {

    private static final int CONNECT_TIMEOUT_MS = 3000;
    private static final int READ_TIMEOUT_MS = 5000;
    private static final int MAX_BYTES = 100 * 1024; // 100 KB
    private static final int MAX_CHARS = 8000;
    private static final int MAX_REDIRECTS = 3;

    private static final Set<String> BLOCKED_HOSTS = Set.of(
            "localhost",
            "metadata.google.internal",
            "metadata.azure.internal",
            "169.254.169.254",
            "instance-data"
    );

    /**
     * Validates whether a given URL is safe to fetch externally.
     * Throws IllegalArgumentException if the URL violates security policies.
     */
    public URI validateUrl(String urlString) {
        if (urlString == null || urlString.isBlank()) {
            throw new IllegalArgumentException("URL cannot be empty or null.");
        }

        URI uri;
        try {
            uri = URI.create(urlString.trim());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL syntax: " + e.getMessage());
        }

        String scheme = uri.getScheme();
        if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
            throw new IllegalArgumentException("Only HTTP and HTTPS protocols are permitted. Rejected: " + scheme);
        }

        String host = uri.getHost();
        if (host == null || host.isBlank()) {
            throw new IllegalArgumentException("URL host is missing or invalid.");
        }

        String lowerHost = host.toLowerCase(Locale.ROOT);
        if (BLOCKED_HOSTS.contains(lowerHost)) {
            throw new IllegalArgumentException("Access to internal/metadata host is prohibited: " + host);
        }

        // Resolve DNS and inspect all returned IP addresses
        InetAddress[] addresses;
        try {
            addresses = InetAddress.getAllByName(host);
        } catch (UnknownHostException e) {
            throw new IllegalArgumentException("Could not resolve hostname: " + host);
        }

        for (InetAddress address : addresses) {
            if (isForbiddenIp(address)) {
                log.warn("Blocked SSRF attempt to forbidden IP: {} (host: {})", address.getHostAddress(), host);
                throw new IllegalArgumentException("Access to internal, loopback, or private IP address is forbidden: " + address.getHostAddress());
            }
        }

        return uri;
    }

    /**
     * Checks if an IP address belongs to loopback, link-local, site-local (private RFC 1918),
     * multicast, or cloud metadata ranges.
     */
    public boolean isForbiddenIp(InetAddress address) {
        if (address.isLoopbackAddress()) return true;
        if (address.isSiteLocalAddress()) return true;
        if (address.isLinkLocalAddress()) return true;
        if (address.isMulticastAddress()) return true;
        if (address.isAnyLocalAddress()) return true;

        String ip = address.getHostAddress();
        if ("169.254.169.254".equals(ip) || "0.0.0.0".equals(ip) || "127.0.0.1".equals(ip) || "::1".equals(ip)) {
            return true;
        }

        // IPv4 100.64.0.0/10 (Carrier-Grade NAT) check
        byte[] bytes = address.getAddress();
        if (bytes.length == 4) {
            int b0 = bytes[0] & 0xFF;
            int b1 = bytes[1] & 0xFF;
            if (b0 == 100 && (b1 >= 64 && b1 <= 127)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Safely fetches textual content from an external URL, stripping scripts/styles/HTML tags.
     * Enforces redirect limits and validates each redirect destination.
     */
    public String fetchSafeContent(String urlString) {
        URI currentUri = validateUrl(urlString);
        int redirects = 0;

        while (redirects <= MAX_REDIRECTS) {
            HttpURLConnection conn = null;
            try {
                conn = (HttpURLConnection) currentUri.toURL().openConnection();
                conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
                conn.setReadTimeout(READ_TIMEOUT_MS);
                conn.setInstanceFollowRedirects(false); // Manually validate redirects
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeMentor-SafeFetcher/1.0");
                conn.setRequestProperty("Accept", "text/html,text/plain,application/xhtml+xml");

                int statusCode = conn.getResponseCode();

                // Handle Redirects
                if (statusCode == HttpURLConnection.HTTP_MOVED_PERM ||
                    statusCode == HttpURLConnection.HTTP_MOVED_TEMP ||
                    statusCode == HttpURLConnection.HTTP_SEE_OTHER ||
                    statusCode == 307 || statusCode == 308) {

                    String location = conn.getHeaderField("Location");
                    if (location == null || location.isBlank()) {
                        throw new IllegalArgumentException("Redirect received with empty Location header.");
                    }
                    URI nextUri = currentUri.resolve(location);
                    currentUri = validateUrl(nextUri.toString());
                    redirects++;
                    continue;
                }

                if (statusCode < 200 || statusCode >= 300) {
                    log.warn("Remote URL returned status {}: {}", statusCode, currentUri);
                    return "";
                }

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder sb = new StringBuilder();
                    char[] buffer = new char[4096];
                    int totalRead = 0;
                    int read;

                    while ((read = reader.read(buffer)) != -1) {
                        sb.append(buffer, 0, read);
                        totalRead += read;
                        if (totalRead >= MAX_BYTES) {
                            break;
                        }
                    }

                    return cleanHtmlToText(sb.toString());
                }

            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                log.warn("Error fetching safe URL {}: {}", currentUri, e.getMessage());
                return "";
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        }

        throw new IllegalArgumentException("Exceeded maximum redirects (" + MAX_REDIRECTS + ")");
    }

    /**
     * Sanitizes raw HTML by removing scripts, styles, HTML tags, and truncating to MAX_CHARS.
     */
    public String cleanHtmlToText(String rawHtml) {
        if (rawHtml == null || rawHtml.isBlank()) return "";

        String cleaned = rawHtml
                .replaceAll("(?is)<script.*?</script>", " ")
                .replaceAll("(?is)<style.*?</style>", " ")
                .replaceAll("<[^>]+>", " ")
                .replaceAll("\\s+", " ")
                .trim();

        if (cleaned.length() > MAX_CHARS) {
            return cleaned.substring(0, MAX_CHARS);
        }
        return cleaned;
    }
}
