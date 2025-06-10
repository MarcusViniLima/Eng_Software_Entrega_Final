package com.engsoftware.apihelpdesk.models.enums;

public enum Status {

    ABERTO ("Aberto"), EM_ANDAMENTO ("Em andamento"), RESOLVIDO ("Resolvido") , ATRASO ("Atraso"), CANCELADO ("Cancelado");

    private String status;

    Status(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

}
