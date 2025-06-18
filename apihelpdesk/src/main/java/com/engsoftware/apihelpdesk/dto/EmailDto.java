package com.engsoftware.apihelpdesk.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailDto {
    private UUID userId;
    private String emailTo;
    private String subject;
    private String text;
}
