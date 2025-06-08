package com.engsoftware.apifuncionario;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import com.engsoftware.apifuncionario.model.FuncionarioModel;
import com.engsoftware.apifuncionario.model.enums.Setor;
import com.engsoftware.apifuncionario.repositorios.FuncionarioRepository;
import com.engsoftware.apifuncionario.services.FuncionarioService;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class FuncionarioServiceTest
 {

    @Mock
    private FuncionarioRepository repository;

    @InjectMocks
    private FuncionarioService service;

    @Test
    void ok() {  
    }

    @Test
    void BuscarFuncionarioExistenteporCpf(){
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.findByCpf("05460769102")).thenReturn(Optional.of(funcionario));

        FuncionarioModel funcionarioEncontrado = service.buscarFuncionarioPorCpf("05460769102");

        assertNotNull(funcionarioEncontrado);
        assertEquals(funcionario.getId(), funcionarioEncontrado.getId());
        assertEquals(funcionario.getCpf(), funcionarioEncontrado.getCpf());
        assertEquals(funcionario.getName(), funcionarioEncontrado.getName());
        assertEquals(funcionario.getEmail(), funcionarioEncontrado.getEmail());
        assertEquals(funcionario.getPassword(), funcionarioEncontrado.getPassword());
        assertEquals(funcionario.getSetor(), funcionarioEncontrado.getSetor());
    }

    @Test
    void ErroBuscarFuncionarioExistenteporCpf(){
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.findByCpf("05460769102")).thenReturn(Optional.of(funcionario));

        //Cpf diferente do cadastrado anteriormente.
        FuncionarioModel funcionarioEncontrado = service.buscarFuncionarioPorCpf("05460769102");

        assertNull(funcionarioEncontrado);
    }



}
