package com.engsoftware.apihelpdesk.models.enums;

public enum Status {

    ABERTO("Aberto", 0),
    EM_ANDAMENTO("Em andamento", 1),
    ATRASO("Atraso", 2),
    RESOLVIDO("Resolvido", 3),
    CANCELADO("Cancelado", 4);

    private final String descricao;
    private final int ordem;

    Status(String descricao, int ordem) {
        this.descricao = descricao;
        this.ordem = ordem;
    }

    public String getDescricao() {
        return descricao;
    }

    public int getOrdem() {
        return ordem;
    }

}
