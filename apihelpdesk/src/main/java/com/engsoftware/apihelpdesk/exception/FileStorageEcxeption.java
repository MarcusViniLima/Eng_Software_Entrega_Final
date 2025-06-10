package com.engsoftware.apihelpdesk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class FileStorageEcxeption  extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    public FileStorageEcxeption(String message) {
        super(message);
    }

    public FileStorageEcxeption(String message, Throwable cause) {
        super(message, cause);
    }

}
