package com.satyamshiv.studytracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "day_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_day", columnNames = {"user_id", "day_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private int dayNumber;

    @Column(nullable = false)
    private boolean completed;
}
