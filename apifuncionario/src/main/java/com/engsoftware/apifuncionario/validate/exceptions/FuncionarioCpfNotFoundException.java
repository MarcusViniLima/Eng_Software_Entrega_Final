package com.engsoftware.apifuncionario.validate.exceptions;

public class FuncionarioCpfNotFoundException extends RuntimeException {

    public FuncionarioCpfNotFoundException(String cpf) {
        super("Funcionario not found with CPF " + cpf);
    }

}
