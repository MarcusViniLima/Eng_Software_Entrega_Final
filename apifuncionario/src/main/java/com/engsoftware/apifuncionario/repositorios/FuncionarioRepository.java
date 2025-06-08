package com.engsoftware.apifuncionario.repositorios;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apifuncionario.model.FuncionarioModel;

@Repository
public interface FuncionarioRepository extends JpaRepository<FuncionarioModel, UUID>{

    Optional<FuncionarioModel> findByCpf(String cpf);
    Optional<FuncionarioModel> findByEmail(String email);

}
