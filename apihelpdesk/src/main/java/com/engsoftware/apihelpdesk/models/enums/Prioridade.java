package com.engsoftware.apihelpdesk.models.enums;

public enum Prioridade {

    ALTA ("Alta"), MEDIA ("Média"), BAIXA ("Baixa");

    private String prioridade;

    Prioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getPrioridade() {
        return prioridade;
    }

}
