package com.satyamshiv.studytracker.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.net.InetAddress;

import static org.junit.jupiter.api.Assertions.*;

class SsrfProtectionValidatorTest {

    private SsrfProtectionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SsrfProtectionValidator();
    }

    @Test
    @DisplayName("Should reject null or empty URL")
    void shouldRejectNullOrEmptyUrl() {
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl(null));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("   "));
    }

    @Test
    @DisplayName("Should reject non-HTTP schemes (e.g. file, ftp, gopher)")
    void shouldRejectNonHttpSchemes() {
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("file:///etc/passwd"));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("ftp://ftp.example.com"));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("gopher://example.com"));
    }

    @Test
    @DisplayName("Should reject localhost and loopback targets")
    void shouldRejectLocalhostAndLoopback() {
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("http://localhost:8080/admin"));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("http://127.0.0.1:3306"));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("http://[::1]:8080"));
    }

    @Test
    @DisplayName("Should reject cloud metadata service endpoints")
    void shouldRejectCloudMetadata() {
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("http://169.254.169.254/latest/meta-data/"));
        assertThrows(IllegalArgumentException.class, () -> validator.validateUrl("http://metadata.google.internal/computeMetadata/v1/"));
    }

    @Test
    @DisplayName("Should identify forbidden IP addresses (loopback, private RFC 1918, link-local)")
    void shouldIdentifyForbiddenIps() throws Exception {
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("127.0.0.1")));
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("10.0.0.1")));
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("172.16.0.1")));
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("192.168.1.1")));
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("169.254.1.1")));
        assertTrue(validator.isForbiddenIp(InetAddress.getByName("0.0.0.0")));

        // Public IP should NOT be forbidden
        assertFalse(validator.isForbiddenIp(InetAddress.getByName("8.8.8.8")));
        assertFalse(validator.isForbiddenIp(InetAddress.getByName("1.1.1.1")));
    }

    @Test
    @DisplayName("Should strip HTML tags, script, and style blocks")
    void shouldCleanHtml() {
        String rawHtml = "<html><head><style>body { color: red; }</style></head><body><h1>Hello World</h1><script>alert(1);</script><p>This is real content.</p></body></html>";
        String cleaned = validator.cleanHtmlToText(rawHtml);

        assertFalse(cleaned.contains("<script>"));
        assertFalse(cleaned.contains("alert(1)"));
        assertFalse(cleaned.contains("<style>"));
        assertFalse(cleaned.contains("color: red"));
        assertTrue(cleaned.contains("Hello World"));
        assertTrue(cleaned.contains("This is real content."));
    }
}
