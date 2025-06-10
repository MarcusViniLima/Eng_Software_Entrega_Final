package com.engsoftware.apisecurity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engsoftware.apisecurity.dtos.AuthenticationResponse;
import com.engsoftware.apisecurity.service.UserService;

@RestController
@RequestMapping("/auth")
public class SecurityController {

    @Autowired
    UserService userService;

    @GetMapping
    public String security() {
        return "security";
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login( @RequestBody AuthenticationResponse user) throws Exception {
        String userLogin= userService.login(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userLogin);
    }

}
