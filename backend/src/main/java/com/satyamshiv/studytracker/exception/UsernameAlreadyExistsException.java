package com.satyamshiv.studytracker.exception;

public class UsernameAlreadyExistsException extends DuplicateResourceException {
    public UsernameAlreadyExistsException(String username) {
        super(String.format("Username '%s' is already taken", username));
    }
}
