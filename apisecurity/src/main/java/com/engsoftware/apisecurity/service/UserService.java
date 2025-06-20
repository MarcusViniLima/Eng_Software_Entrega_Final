package com.engsoftware.apisecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.engsoftware.apisecurity.configs.WebSecurityConfig;
import com.engsoftware.apisecurity.dtos.AuthenticationRegister;
import com.engsoftware.apisecurity.dtos.AuthenticationResponse;
import com.engsoftware.apisecurity.models.UserModel;
import com.engsoftware.apisecurity.models.enums.AcessLevels;
import com.engsoftware.apisecurity.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WebSecurityConfig webSecurityConfig;
    @Autowired
    private TokenService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public UserModel save(AuthenticationRegister users) throws Exception {
        if (userRepository.existsByEmail(users.getEmail())) {
            throw new Exception(String.format("Email '%s' já cadastrado", users.getEmail()));
        }
        try {
            AcessLevels role = AcessLevels.valueOf(users.getAcessLevel().toUpperCase());
            var user = new UserModel(users.getEmail(), users.getPassword(), role);
            user.setPassword(webSecurityConfig.passwordEncoder().encode(user.getPassword()));
            return userRepository.save(user);
        } catch (Exception e) {
            throw new Exception("Erro to save user", e);
        }
    }

    public String login(AuthenticationResponse user) throws Exception {
        if (user == null) {
            throw new NullPointerException("User cannot be null");
        }
        if (!userRepository.existsByEmail(user.getEmail())) {
            throw new Exception(String.format("Email '%s' não cadastrado", user.getEmail()));
        }
        try {
            System.out.println("Tentando autenticar: " + user.getEmail());
            var usernamePassword = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
            var auth = authenticationManager.authenticate(usernamePassword);

            var principal = (UserDetails) auth.getPrincipal();
            return jwtService.generateToken(principal);
        } catch (Exception e) {
            throw new Exception("Erro ao autenticar usuário: " + e.getMessage());
        }
    }

    public UserModel findByEmail(String email) {
        try {
            return userRepository.findByEmail(email).get();
        } catch (Exception e) {
            throw new RuntimeException("User doesn't exist", e);
        }
    }

}
