package com.engsoftware.apihelpdesk.models.enums;

public enum Prioridade {

    ALTA("Alta", 2),
    MEDIA("Média", 1),
    BAIXA("Baixa", 0);

    private final String descricao;
    private final int peso;

    Prioridade(String descricao, int peso) {
        this.descricao = descricao;
        this.peso = peso;
    }

    public String getDescricao() {
        return descricao;
    }

    public int getPeso() {
        return peso;
    }

}
