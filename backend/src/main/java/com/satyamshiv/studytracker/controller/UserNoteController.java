package com.satyamshiv.studytracker.controller;

import com.satyamshiv.studytracker.dto.SaveNoteRequest;
import com.satyamshiv.studytracker.dto.UserNoteDto;
import com.satyamshiv.studytracker.security.UserPrincipal;
import com.satyamshiv.studytracker.service.UserNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class UserNoteController {

    private final UserNoteService noteService;

    @GetMapping("/me")
    public ResponseEntity<Map<Integer, String>> getMyNotesMap(@AuthenticationPrincipal UserPrincipal principal) {
        List<UserNoteDto> notes = noteService.getUserNotes(principal.getId());
        Map<Integer, String> map = new HashMap<>();
        for (UserNoteDto n : notes) {
            map.put(n.getDayNumber(), n.getContent());
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("/me/{dayNumber}")
    public ResponseEntity<UserNoteDto> getMyNoteForDay(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber) {
        UserNoteDto dto = noteService.getNoteForDay(principal.getId(), dayNumber);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.ok(UserNoteDto.builder().dayNumber(dayNumber).content("").build());
    }

    @PostMapping("/me/{dayNumber}")
    public ResponseEntity<UserNoteDto> saveNote(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable int dayNumber,
            @RequestBody SaveNoteRequest request) {
        String content = request != null && request.getContent() != null ? request.getContent() : "";
        return ResponseEntity.ok(noteService.saveOrUpdateNote(principal.getId(), dayNumber, content));
    }
}
