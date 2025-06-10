package com.engsoftware.apisecurity.models.enums;

public enum AcessLevels {
    USER("user"),
    TI("ti"),
    ADMIN("admin");

    private final String role;

    AcessLevels(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}
