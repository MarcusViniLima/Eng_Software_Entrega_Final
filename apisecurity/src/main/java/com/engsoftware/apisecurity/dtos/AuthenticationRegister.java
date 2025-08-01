package com.engsoftware.apisecurity.dtos;




import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRegister {
    
    private String email;
    private String password;
    private String acessLevel;
}
