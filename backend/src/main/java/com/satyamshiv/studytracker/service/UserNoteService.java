package com.satyamshiv.studytracker.service;

import com.satyamshiv.studytracker.dto.UserNoteDto;
import com.satyamshiv.studytracker.exception.UserNotFoundException;
import com.satyamshiv.studytracker.model.User;
import com.satyamshiv.studytracker.model.UserNote;
import com.satyamshiv.studytracker.repository.UserNoteRepository;
import com.satyamshiv.studytracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserNoteService {

    private final UserNoteRepository noteRepository;
    private final UserRepository userRepository;

    public List<UserNoteDto> getUserNotes(Long userId) {
        return noteRepository.findByUserIdOrderByDayNumberAsc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserNoteDto getNoteForDay(Long userId, int dayNumber) {
        return noteRepository.findByUserIdAndDayNumber(userId, dayNumber)
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public UserNoteDto saveOrUpdateNote(Long userId, int dayNumber, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        UserNote note = noteRepository.findByUserIdAndDayNumber(userId, dayNumber)
                .orElse(UserNote.builder()
                        .user(user)
                        .dayNumber(dayNumber)
                        .build());

        note.setContent(content);
        return toDto(noteRepository.save(note));
    }

    private UserNoteDto toDto(UserNote n) {
        return UserNoteDto.builder()
                .id(n.getId())
                .dayNumber(n.getDayNumber())
                .content(n.getContent())
                .updatedAt(n.getUpdatedAt())
                .build();
    }
}
