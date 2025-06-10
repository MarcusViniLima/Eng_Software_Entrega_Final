package com.engsoftware.apifuncionario.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engsoftware.apifuncionario.model.FuncionarioModel;
import com.engsoftware.apifuncionario.producers.FuncionarioProducer;
import com.engsoftware.apifuncionario.repositorios.FuncionarioRepository;
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioAlreadySavedException;
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioCpfNotFoundException;
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioEmailNotFoundException;


@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository repository;
    @Autowired
    private FuncionarioProducer producer;

	public FuncionarioModel buscarFuncionarioPorCpf(String cpf) {
        FuncionarioModel funcionario = repository.findByCpf(cpf).orElseThrow(() -> new FuncionarioCpfNotFoundException(cpf));

		return funcionario;
	}
    public FuncionarioModel buscarFuncionarioPorEmail(String email) {
        FuncionarioModel funcionario = repository.findByEmail(email).orElseThrow(() -> new FuncionarioEmailNotFoundException(email));

        return funcionario;
    }

    public FuncionarioModel salvarFuncionario(FuncionarioModel funcionario) {
        if(repository.findByCpf(funcionario.getCpf()).isPresent()) throw new FuncionarioAlreadySavedException(funcionario.getCpf());
        if(repository.findByEmail(funcionario.getEmail()).isPresent()) throw new FuncionarioAlreadySavedException(funcionario.getEmail());
        producer.publishMessageUser(funcionario);
        return repository.save(funcionario);
    }

    public List<FuncionarioModel> buscarTodosFuncionarios() {
        return repository.findAll();
    }

}
