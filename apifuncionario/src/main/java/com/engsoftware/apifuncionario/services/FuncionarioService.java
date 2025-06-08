package com.engsoftware.apifuncionario.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engsoftware.apifuncionario.model.FuncionarioModel;
import com.engsoftware.apifuncionario.repositorios.FuncionarioRepository;
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioNotFoundException;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository repository;

	public FuncionarioModel buscarFuncionarioPorCpf(String cpf) {
        FuncionarioModel funcionario = repository.findByCpf(cpf).orElseThrow(() -> new FuncionarioNotFoundException(cpf));

		return funcionario;
	}



}
