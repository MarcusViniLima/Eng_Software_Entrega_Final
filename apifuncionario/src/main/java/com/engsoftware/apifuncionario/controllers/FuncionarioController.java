package com.engsoftware.apifuncionario.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engsoftware.apifuncionario.model.FuncionarioModel;
import com.engsoftware.apifuncionario.services.FuncionarioService;


@RestController
@RequestMapping("/funcionario")
public class FuncionarioController {

    @Autowired
    private FuncionarioService service;


    @GetMapping
    public String status() {
        return "OK";        
    }
    
    @GetMapping("/all")
    public String all() {
        return service.buscarTodosFuncionarios().toString();        
    }

    @PostMapping
    public ResponseEntity<FuncionarioModel> salvarFuncionario(@RequestBody FuncionarioModel funcionario) {
        return ResponseEntity.ok(service.salvarFuncionario(funcionario));        
    }
}
