package com.engsoftware.apisecurity.controller;

import java.util.Collections;
import java.util.Map;

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

import jakarta.validation.Valid;

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
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthenticationResponse user) throws Exception {
        String token = userService.login(user);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

}
