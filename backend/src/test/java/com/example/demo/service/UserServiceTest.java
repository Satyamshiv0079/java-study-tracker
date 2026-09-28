package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("satyam")
                .email("satyam@example.com")
                .password("$2a$10$hashedPasswordHere")
                .role("USER")
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user with BCrypt hashed password")
    void shouldRegisterNewUser() {
        when(userRepository.existsByUsername("satyam")).thenReturn(false);
        when(userRepository.existsByEmail("satyam@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$10$hashedPasswordHere");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        User registered = userService.registerUser("satyam", "satyam@example.com", "secret123");

        assertNotNull(registered);
        assertEquals("satyam", registered.getUsername());
        verify(passwordEncoder, times(1)).encode("secret123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when registering duplicate username")
    void shouldThrowOnDuplicateUsername() {
        when(userRepository.existsByUsername("satyam")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.registerUser("satyam", "other@example.com", "secret123"));

        assertTrue(ex.getMessage().contains("Username is already taken"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when registering duplicate email")
    void shouldThrowOnDuplicateEmail() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("satyam@example.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.registerUser("newuser", "satyam@example.com", "secret123"));

        assertTrue(ex.getMessage().contains("Email is already registered"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when password is less than 6 characters")
    void shouldThrowOnShortPassword() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.registerUser("newuser", "new@example.com", "123"));

        assertTrue(ex.getMessage().contains("at least 6 characters"));
    }

    @Test
    @DisplayName("Should successfully login user with correct credentials")
    void shouldLoginWithValidCredentials() {
        when(userRepository.findByUsername("satyam")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("secret123", sampleUser.getPassword())).thenReturn(true);

        User loggedIn = userService.loginUser("satyam", "secret123");

        assertNotNull(loggedIn);
        assertEquals("satyam", loggedIn.getUsername());
    }

    @Test
    @DisplayName("Should reject login with incorrect password")
    void shouldRejectLoginWithWrongPassword() {
        when(userRepository.findByUsername("satyam")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpass", sampleUser.getPassword())).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.loginUser("satyam", "wrongpass"));

        assertTrue(ex.getMessage().contains("Invalid username or password"));
    }

    @Test
    @DisplayName("Should reject login for non-existent username")
    void shouldRejectLoginForNonexistentUser() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.loginUser("ghost", "pass"));

        assertTrue(ex.getMessage().contains("Invalid username or password"));
    }
}
