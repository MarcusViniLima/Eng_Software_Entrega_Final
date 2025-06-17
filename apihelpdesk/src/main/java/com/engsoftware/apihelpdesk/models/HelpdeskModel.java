package com.engsoftware.apihelpdesk.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.engsoftware.apihelpdesk.models.enums.Prioridade;
import com.engsoftware.apihelpdesk.models.enums.Setor;
import com.engsoftware.apihelpdesk.models.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HelpdeskModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 2000)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridade prioridade;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ABERTO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Setor setor;
    
    @OneToMany(mappedBy = "helpdesk", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataComentario ASC")
    private List<ComentarioModel> comentarios = new ArrayList<>();
    
    @Column(nullable = false)
    private String emailUsername;
    
    @Column(name = "email_responsavel_ti")
    private String emailResponsavelTI;
    
    @Column(nullable = false)
    private LocalDateTime dataAbertura;
    
    private LocalDateTime dataEncerramento;
    
    private String fileName;
    
    public void addComentario(ComentarioModel comentario) {
        comentarios.add(comentario);
        comentario.setHelpdesk(this);
    }
}