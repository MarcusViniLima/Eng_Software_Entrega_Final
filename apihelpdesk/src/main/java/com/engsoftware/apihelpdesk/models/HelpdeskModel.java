package com.engsoftware.apihelpdesk.models;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.engsoftware.apihelpdesk.models.enums.Prioridade;
import com.engsoftware.apihelpdesk.models.enums.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class HelpdeskModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String title;
    private String message;
    private  Prioridade prioridade;
    private Status status;
    private List<ComentarioModel> comentarios;
    private String emailUsername;
    private String emailReponsavelTi;
    private LocalDate dataAbertura;
    private LocalDate dataEncerramento;


}
