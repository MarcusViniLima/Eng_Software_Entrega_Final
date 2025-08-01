package com.engsoftware.apihelpdesk.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComentarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String emailUsername;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helpdesk_id", nullable = false)
    @JsonBackReference
    private HelpdeskModel helpdesk;
    
    @Column(nullable = false, length = 2000)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime dataComentario;
    
    private UUID idUser;
}
