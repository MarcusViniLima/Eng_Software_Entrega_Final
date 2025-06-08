package com.engsoftware.apifuncionario.model;

import java.util.UUID;

import com.engsoftware.apifuncionario.model.enums.Setor;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class FuncionarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String cpf;
    private String nome;

    @Enumerated(EnumType.STRING)
    private Setor setor;

}
