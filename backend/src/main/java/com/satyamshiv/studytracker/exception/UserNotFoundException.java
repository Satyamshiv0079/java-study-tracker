package com.satyamshiv.studytracker.exception;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long userId) {
        super("User", "id", userId);
    }

    public UserNotFoundException(String fieldName, String value) {
        super("User", fieldName, value);
    }
}
