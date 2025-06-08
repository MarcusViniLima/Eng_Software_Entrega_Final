package com.engsoftware.apifuncionario.validate.exceptions;

public class FuncionarioAlreadySavedException extends RuntimeException {
    public FuncionarioAlreadySavedException(String cpf) {
        super("Funcionario already saved with CPF " + cpf);
    }

}
