package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.ProjectMilestoneDto;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.ProjectMilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectMilestoneController {

    private final ProjectMilestoneService milestoneService;

    @GetMapping("/me")
    public ResponseEntity<List<ProjectMilestoneDto>> getMyMilestones(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(milestoneService.getUserMilestones(principal.getId()));
    }

    @PostMapping("/me/{milestoneId}/toggle")
    public ResponseEntity<ProjectMilestoneDto> toggleMilestone(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int milestoneId) {
        return ResponseEntity.ok(milestoneService.toggleMilestone(principal.getId(), milestoneId));
    }
}
