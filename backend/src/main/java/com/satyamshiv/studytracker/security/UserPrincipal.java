package com.satyamshiv.studytracker.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@Getter
@AllArgsConstructor
public class UserPrincipal implements Principal {

    private final Long id;
    private final String username;
    private final String role;

    @Override
    public String getName() {
        return username;
    }
}
