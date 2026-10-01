package com.satyamshiv.studytracker;

import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StudyTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByUsername("satyam")) {
                User defaultUser = User.builder()
                        .username("satyam")
                        .email("satyam@example.com")
                        .password(encoder.encode("secret123")) // BCrypt encrypted!
                        .role("USER")
                        .build();
                userRepository.save(defaultUser);
            }
        };
    }
}
