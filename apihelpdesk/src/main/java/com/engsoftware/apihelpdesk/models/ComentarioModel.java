package com.engsoftware.apihelpdesk.models;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class ComentarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String emailUsername;
    @ManyToOne
    @JoinColumn(name = "helpdesk_id")
    private HelpdeskModel helpdesk;
    private String message;
    private LocalDate dataComentario;
    private String idUser;

}
