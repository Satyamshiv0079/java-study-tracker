package com.example.demo.service;

import com.example.demo.dto.DsaSubmissionDto;
import com.example.demo.dto.DsaSubmissionRequest;
import com.example.demo.model.DsaSubmission;
import com.example.demo.model.User;
import com.example.demo.repository.DsaSubmissionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DsaSubmissionService {

    private final DsaSubmissionRepository dsaRepository;
    private final UserRepository userRepository;

    public List<DsaSubmissionDto> getUserSubmissions(Long userId) {
        return dsaRepository.findByUserIdOrderByDayNumberAsc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DsaSubmissionDto getSubmissionByDay(Long userId, int dayNumber) {
        return dsaRepository.findByUserIdAndDayNumber(userId, dayNumber)
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public DsaSubmissionDto saveOrUpdate(Long userId, DsaSubmissionRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DsaSubmission sub = dsaRepository.findByUserIdAndDayNumber(userId, req.getDayNumber())
                .orElse(DsaSubmission.builder()
                        .user(user)
                        .dayNumber(req.getDayNumber())
                        .build());

        if (req.getProblemTitle() != null) sub.setProblemTitle(req.getProblemTitle());
        if (req.getCode() != null) sub.setCode(req.getCode());
        if (req.getLanguage() != null) sub.setLanguage(req.getLanguage());
        sub.setCompleted(req.isCompleted());
        if (req.getTimeComplexity() != null) sub.setTimeComplexity(req.getTimeComplexity());
        if (req.getSpaceComplexity() != null) sub.setSpaceComplexity(req.getSpaceComplexity());

        return toDto(dsaRepository.save(sub));
    }

    @Transactional
    public DsaSubmissionDto toggleCompleted(Long userId, int dayNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DsaSubmission sub = dsaRepository.findByUserIdAndDayNumber(userId, dayNumber)
                .orElse(DsaSubmission.builder()
                        .user(user)
                        .dayNumber(dayNumber)
                        .completed(false)
                        .build());

        sub.setCompleted(!sub.isCompleted());
        return toDto(dsaRepository.save(sub));
    }

    public long getCompletedCount(Long userId) {
        return dsaRepository.countByUserIdAndCompletedTrue(userId);
    }

    private DsaSubmissionDto toDto(DsaSubmission s) {
        return DsaSubmissionDto.builder()
                .id(s.getId())
                .dayNumber(s.getDayNumber())
                .problemTitle(s.getProblemTitle())
                .code(s.getCode())
                .language(s.getLanguage())
                .completed(s.isCompleted())
                .timeComplexity(s.getTimeComplexity())
                .spaceComplexity(s.getSpaceComplexity())
                .submittedAt(s.getSubmittedAt())
                .build();
    }
}
