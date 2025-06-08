package com.engsoftware.apifuncionario.validate.exceptions;

public class FuncionarioNotFoundException extends RuntimeException {

    public FuncionarioNotFoundException(String cpf) {
        super("Funcionario not found with CPF " + cpf);
    }

}
