package com.engsoftware.apifuncionario.model.enums;

public enum Setor {

    TI("TI"),
    RH("RH"),
    FINANCEIRO("FINANCEIRO"),
    MARKETING("MARKETING"),
    VENDAS("VENDAS");

    private final String setor;

    Setor(String setor) {
        this.setor = setor;
    }

    public String getSetor() {
        return setor;
    }

}
