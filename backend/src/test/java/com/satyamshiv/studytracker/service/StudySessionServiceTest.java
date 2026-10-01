package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.LogSessionRequest;
import com.satyamshiv.studytracker.dto.StudySessionDto;
import com.satyamshiv.studytracker.model.StudySession;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.StudySessionRepository;
import com.satyamshiv.studytracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudySessionServiceTest {

    @Mock
    private StudySessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudySessionService sessionService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).username("satyam").build();
    }

    @Test
    @DisplayName("Should successfully log a pomodoro study session")
    void shouldLogSession() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(sessionRepository.save(any(StudySession.class))).thenAnswer(i -> {
            StudySession s = i.getArgument(0);
            s.setId(50L);
            return s;
        });

        LogSessionRequest req = LogSessionRequest.builder()
                .durationMinutes(25)
                .mode("pomodoro")
                .build();

        StudySessionDto dto = sessionService.logSession(1L, req);

        assertNotNull(dto);
        assertEquals(25, dto.getDurationMinutes());
        assertEquals("pomodoro", dto.getMode());
        verify(sessionRepository, times(1)).save(any(StudySession.class));
    }

    @Test
    @DisplayName("Should correctly aggregate total study hours from minutes")
    void shouldCalculateTotalStudyHours() {
        when(sessionRepository.getTotalStudyMinutes(1L)).thenReturn(150L); // 2.5 hours

        double hours = sessionService.getTotalStudyHours(1L);

        assertEquals(2.5, hours);
    }
}
