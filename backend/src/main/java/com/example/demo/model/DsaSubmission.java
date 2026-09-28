package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dsa_submissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "day_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DsaSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "day_number", nullable = false)
    private int dayNumber;

    @Column(name = "problem_title")
    private String problemTitle;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Column(length = 32)
    private String language;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "time_complexity", length = 64)
    private String timeComplexity;

    @Column(name = "space_complexity", length = 64)
    private String spaceComplexity;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.submittedAt = LocalDateTime.now();
    }
}
