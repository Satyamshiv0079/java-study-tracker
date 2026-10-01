package com.satyamshiv.studytracker.repository;

import com.satyamshiv.studytracker.model.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, Long> {
    List<UserNote> findByUserIdOrderByDayNumberAsc(Long userId);
    Optional<UserNote> findByUserIdAndDayNumber(Long userId, int dayNumber);
}
