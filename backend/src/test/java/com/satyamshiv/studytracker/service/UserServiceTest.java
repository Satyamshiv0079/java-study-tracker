package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.exception.EmailAlreadyExistsException;
import com.satyamshiv.studytracker.exception.InvalidCredentialsException;
import com.satyamshiv.studytracker.exception.UsernameAlreadyExistsException;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.UserRepository;
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
    @DisplayName("Should throw UsernameAlreadyExistsException when registering duplicate username")
    void shouldThrowOnDuplicateUsername() {
        when(userRepository.existsByUsername("satyam")).thenReturn(true);

        UsernameAlreadyExistsException ex = assertThrows(UsernameAlreadyExistsException.class, () ->
                userService.registerUser("satyam", "other@example.com", "secret123"));

        assertTrue(ex.getMessage().contains("already taken"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException when registering duplicate email")
    void shouldThrowOnDuplicateEmail() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("satyam@example.com")).thenReturn(true);

        EmailAlreadyExistsException ex = assertThrows(EmailAlreadyExistsException.class, () ->
                userService.registerUser("newuser", "satyam@example.com", "secret123"));

        assertTrue(ex.getMessage().contains("already registered"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when password is less than 6 characters")
    void shouldThrowOnShortPassword() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
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
    @DisplayName("Should throw InvalidCredentialsException for incorrect password")
    void shouldRejectLoginWithWrongPassword() {
        when(userRepository.findByUsername("satyam")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpass", sampleUser.getPassword())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () ->
                userService.loginUser("satyam", "wrongpass"));
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException for non-existent username")
    void shouldRejectLoginForNonexistentUser() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () ->
                userService.loginUser("ghost", "pass"));
    }
}
