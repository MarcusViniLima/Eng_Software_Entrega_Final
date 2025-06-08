package com.engsoftware.apifuncionario.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionario")
public class FuncionarioController {


    @GetMapping
    public String status() {
        return "OK";        
    }
}
