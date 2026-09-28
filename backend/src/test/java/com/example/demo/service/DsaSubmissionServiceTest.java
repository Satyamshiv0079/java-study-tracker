package com.example.demo.service;

import com.example.demo.dto.DsaSubmissionDto;
import com.example.demo.dto.DsaSubmissionRequest;
import com.example.demo.model.DsaSubmission;
import com.example.demo.model.User;
import com.example.demo.repository.DsaSubmissionRepository;
import com.example.demo.repository.UserRepository;
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
class DsaSubmissionServiceTest {

    @Mock
    private DsaSubmissionRepository dsaRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DsaSubmissionService dsaService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).username("satyam").build();
    }

    @Test
    @DisplayName("Should save or update a DSA submission")
    void shouldSaveSubmission() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(dsaRepository.findByUserIdAndDayNumber(1L, 10)).thenReturn(Optional.empty());
        when(dsaRepository.save(any(DsaSubmission.class))).thenAnswer(i -> {
            DsaSubmission s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        DsaSubmissionRequest req = DsaSubmissionRequest.builder()
                .dayNumber(10)
                .problemTitle("Two Sum")
                .code("class Solution {}")
                .language("java")
                .completed(true)
                .timeComplexity("O(N)")
                .spaceComplexity("O(N)")
                .build();

        DsaSubmissionDto dto = dsaService.saveOrUpdate(1L, req);

        assertNotNull(dto);
        assertEquals(10, dto.getDayNumber());
        assertEquals("Two Sum", dto.getProblemTitle());
        assertTrue(dto.isCompleted());
        assertEquals("O(N)", dto.getTimeComplexity());
    }

    @Test
    @DisplayName("Should toggle completion state of a DSA submission")
    void shouldToggleCompleted() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(dsaRepository.findByUserIdAndDayNumber(1L, 10)).thenReturn(Optional.empty());
        when(dsaRepository.save(any(DsaSubmission.class))).thenAnswer(i -> i.getArgument(0));

        DsaSubmissionDto dto = dsaService.toggleCompleted(1L, 10);

        assertNotNull(dto);
        assertTrue(dto.isCompleted());
    }

    @Test
    @DisplayName("Should count completed submissions")
    void shouldCountCompleted() {
        when(dsaRepository.countByUserIdAndCompletedTrue(1L)).thenReturn(15L);

        long count = dsaService.getCompletedCount(1L);

        assertEquals(15L, count);
    }
}
