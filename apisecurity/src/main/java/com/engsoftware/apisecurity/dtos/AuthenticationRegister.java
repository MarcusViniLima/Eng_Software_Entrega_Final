package com.engsoftware.apisecurity.dtos;

import com.engsoftware.apisecurity.models.enums.AcessLevels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRegister {

    private String email;
    private String password;
    private AcessLevels role;
}
