package com.vippro.AuthorizationServer.advice;

import com.vippro.AuthorizationServer.dto.ErrorDetails;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDetails> exceptionIllegalArgumentHandler(IllegalArgumentException exception) {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setMessage(exception.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDetails> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setMessage("Database constraint violation: " + ex.getRootCause().getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

}
