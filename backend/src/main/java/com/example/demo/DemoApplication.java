package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsByUsername("satyam")) {
                User defaultUser = User.builder()
                        .username("satyam")
                        .email("satyam@example.com")
                        .password("secret123") // No encryption needed for local test mode
                        .role("USER")
                        .build();
                userRepository.save(defaultUser);
            }
        };
    }
}
