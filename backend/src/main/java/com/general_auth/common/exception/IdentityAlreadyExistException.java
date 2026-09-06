package com.general_auth.common.exception;

public class IdentityAlreadyExistException extends RuntimeException {
    public IdentityAlreadyExistException(String message) {
        super(message);
    }
}
