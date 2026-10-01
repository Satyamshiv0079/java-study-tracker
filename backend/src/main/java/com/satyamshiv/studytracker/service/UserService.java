package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.exception.EmailAlreadyExistsException;
import com.satyamshiv.studytracker.exception.InvalidCredentialsException;
import com.satyamshiv.studytracker.exception.UsernameAlreadyExistsException;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(String username, String email, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException(username);
        }

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }

        if (rawPassword == null || rawPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long!");
        }

        User user = User.builder()
                .username(username.trim())
                .email(email.trim().toLowerCase())
                .password(passwordEncoder.encode(rawPassword)) // Secure BCrypt hashing!
                .role("USER")
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public User loginUser(String username, String rawPassword) {
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(InvalidCredentialsException::new);

        // Strict BCrypt password matching
        boolean isMatch = passwordEncoder.matches(rawPassword, user.getPassword());

        if (!isMatch) {
            throw new InvalidCredentialsException();
        }

        return user;
    }
}
