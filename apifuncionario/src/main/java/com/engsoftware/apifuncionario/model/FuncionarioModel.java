package com.engsoftware.apifuncionario.model;

import java.util.UUID;

import com.engsoftware.apifuncionario.model.enums.Setor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FuncionarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String cpf;

    @NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[A-Z][a-z]*", message =
    "Surname must start with an uppercase letter.")
    private String name;

    @Email
    @Column(unique = true)
    private String email;


    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$", message = "Password must contain one uppercase, one lowercase, one number, and one special character.")
    private String password;


    @Enumerated(EnumType.STRING)
    private Setor setor;

    private String idUser;




}
