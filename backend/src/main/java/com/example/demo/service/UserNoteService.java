package com.example.demo.service;

import com.example.demo.dto.UserNoteDto;
import com.example.demo.model.User;
import com.example.demo.model.UserNote;
import com.example.demo.repository.UserNoteRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
                .orElseThrow(() -> new RuntimeException("User not found"));

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
