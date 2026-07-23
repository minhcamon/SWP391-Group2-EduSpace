package org.eduspace.backend.exception;

import org.eduspace.backend.dto.common.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<APIResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(
                APIResponse.error(403, "You are not authorized to access this resource!", null));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<APIResponse<Object>> handleBadRequestException(BadRequestException ex) {
        return ResponseEntity.status(400).body(
                APIResponse.error(400, ex.getMessage(), null));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<APIResponse<Object>> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.status(404).body(
                APIResponse.error(404, ex.getMessage(), null));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<APIResponse<Object>> handleForbiddenException(ForbiddenException ex) {
        return ResponseEntity.status(403).body(
                APIResponse.error(403, ex.getMessage(), null));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<APIResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
                APIResponse.error(400, ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                APIResponse.error(400, message, null));
    }
}
