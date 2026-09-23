package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered!");
        }

        if (rawPassword == null || rawPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long!");
        }

        User user = User.builder()
                .username(username.trim())
                .email(email.trim().toLowerCase())
                .password(passwordEncoder.encode(rawPassword)) // Secure BCrypt hashing!
                .role("USER")
                .build();

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User loginUser(String username, String rawPassword) {
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // BCrypt password matching with fallback for legacy plaintext passwords
        boolean isMatch = passwordEncoder.matches(rawPassword, user.getPassword()) || rawPassword.equals(user.getPassword());

        if (!isMatch) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }
}
