package com.general_auth.common.security;

import com.general_auth.common.exception.ForbiddenException;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;

public final class AuthUtils {

    private AuthUtils() {
    }

    public static void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw new ForbiddenException("This operation requires role: " + role);
        }
    }
}