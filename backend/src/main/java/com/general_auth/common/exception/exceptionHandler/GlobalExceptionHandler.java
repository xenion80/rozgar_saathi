package com.general_auth.common.exception.exceptionHandler;

import com.general_auth.common.exception.*;
import com.general_auth.common.response.ApiError;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(ResourceNotFoundException exception, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(exception.getMessage(),HttpStatus.NOT_FOUND,request.getRequestURI()));
    }

    @ExceptionHandler(IdentityAlreadyExistException.class)
    public ResponseEntity<ApiError> handleIdentityAlreadyExistException(IdentityAlreadyExistException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(exception.getMessage(), HttpStatus.CONFLICT, request.getRequestURI()));
    }

    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationServiceException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError(exception.getMessage(), HttpStatus.UNAUTHORIZED, request.getRequestURI()));
    }
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiError> handleJwtException(JwtException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new ApiError(exception.getMessage(), HttpStatus.NOT_ACCEPTABLE,request.getRequestURI()));
    }
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiError> handleExpiredJwtException(ExpiredJwtException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError(exception.getMessage(), HttpStatus.FORBIDDEN, request.getRequestURI()));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgumentException(IllegalArgumentException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(exception.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiError> handleForbiddenException(ForbiddenException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError(exception.getMessage(), HttpStatus.FORBIDDEN, request.getRequestURI()));
    }

    @ExceptionHandler(DuplicateApplicationException.class)
    public ResponseEntity<ApiError> handleDuplicateApplicationException(DuplicateApplicationException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(exception.getMessage(), HttpStatus.CONFLICT, request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException exception,HttpServletRequest request){
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Invalid request body");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(message, HttpStatus.BAD_REQUEST, request.getRequestURI()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableMessage(HttpMessageNotReadableException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError("Invalid request body or enum value", HttpStatus.BAD_REQUEST, request.getRequestURI()));
    }
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiError> handleInvalidTokenException(InvalidTokenException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError(exception.getMessage(),HttpStatus.UNAUTHORIZED,request.getRequestURI()));
    }
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ApiError> handleTokenNotFoundException(TokenNotFoundException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError(exception.getMessage(),HttpStatus.UNAUTHORIZED,request.getRequestURI()));
    }
    @ExceptionHandler(TokenRevokedException.class)
    public ResponseEntity<ApiError> handleTokenRevokedException(TokenRevokedException exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError(exception.getMessage(),HttpStatus.UNAUTHORIZED,request.getRequestURI()));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception exception,HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI()));
    }
}
