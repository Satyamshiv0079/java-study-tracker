package com.example.demo.service;

import com.example.demo.model.DayProgress;
import com.example.demo.model.User;
import com.example.demo.repository.DayProgressRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DayProgressServiceTest {

    @Mock
    private DayProgressRepository progressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DayProgressService progressService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).username("satyam").build();
    }

    @Test
    @DisplayName("Should toggle uncompleted day to completed")
    void shouldToggleDayToCompleted() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(progressRepository.findByUserIdAndDayNumber(1L, 5)).thenReturn(Optional.empty());
        when(progressRepository.save(any(DayProgress.class))).thenAnswer(invocation -> {
            DayProgress p = invocation.getArgument(0);
            p.setId(10L);
            return p;
        });

        DayProgress result = progressService.toggleDay(1L, 5);

        assertNotNull(result);
        assertEquals(5, result.getDayNumber());
        assertTrue(result.isCompleted());
        verify(progressRepository, times(1)).save(any(DayProgress.class));
    }

    @Test
    @DisplayName("Should toggle already completed day to uncompleted")
    void shouldToggleCompletedDayToFalse() {
        DayProgress existing = DayProgress.builder()
                .id(10L)
                .user(sampleUser)
                .dayNumber(5)
                .completed(true)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(progressRepository.findByUserIdAndDayNumber(1L, 5)).thenReturn(Optional.of(existing));
        when(progressRepository.save(any(DayProgress.class))).thenAnswer(i -> i.getArgument(0));

        DayProgress result = progressService.toggleDay(1L, 5);

        assertNotNull(result);
        assertFalse(result.isCompleted());
    }

    @Test
    @DisplayName("Should return list of day progress for user")
    void shouldReturnUserProgress() {
        List<DayProgress> list = List.of(
                DayProgress.builder().id(1L).dayNumber(1).completed(true).build(),
                DayProgress.builder().id(2L).dayNumber(2).completed(false).build()
        );
        when(progressRepository.findByUserId(1L)).thenReturn(list);

        List<DayProgress> result = progressService.getUserProgress(1L);

        assertEquals(2, result.size());
        assertTrue(result.get(0).isCompleted());
        assertFalse(result.get(1).isCompleted());
    }
}
