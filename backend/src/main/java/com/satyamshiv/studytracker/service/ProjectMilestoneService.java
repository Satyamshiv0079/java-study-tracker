package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.ProjectMilestoneDto;
import com.satyamshiv.studytracker.exception.UserNotFoundException;
import com.satyamshiv.studytracker.model.ProjectMilestoneProgress;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.repository.ProjectMilestoneRepository;
import com.satyamshiv.studytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMilestoneService {

    private final ProjectMilestoneRepository milestoneRepository;
    private final UserRepository userRepository;

    public List<ProjectMilestoneDto> getUserMilestones(Long userId) {
        return milestoneRepository.findByUserIdOrderByMilestoneIdAsc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectMilestoneDto toggleMilestone(Long userId, int milestoneId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        ProjectMilestoneProgress progress = milestoneRepository.findByUserIdAndMilestoneId(userId, milestoneId)
                .orElse(ProjectMilestoneProgress.builder()
                        .user(user)
                        .milestoneId(milestoneId)
                        .completed(false)
                        .build());

        progress.setCompleted(!progress.isCompleted());
        return toDto(milestoneRepository.save(progress));
    }

    public long getCompletedCount(Long userId) {
        return milestoneRepository.countByUserIdAndCompletedTrue(userId);
    }

    private ProjectMilestoneDto toDto(ProjectMilestoneProgress p) {
        return ProjectMilestoneDto.builder()
                .id(p.getId())
                .milestoneId(p.getMilestoneId())
                .completed(p.isCompleted())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
