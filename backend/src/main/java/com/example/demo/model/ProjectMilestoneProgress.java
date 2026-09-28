package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_milestone_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "milestone_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMilestoneProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "milestone_id", nullable = false)
    private int milestoneId; // 1 - 8

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
