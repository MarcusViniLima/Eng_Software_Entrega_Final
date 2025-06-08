package com.engsoftware.apifuncionario.validate.exceptions;

public class FuncionarioEmailNotFoundException extends RuntimeException {

    public FuncionarioEmailNotFoundException(String email) {
        super("Funcionario not found with email " + email);
    }

}
