package com.engsoftware.apifuncionario;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
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
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioAlreadySavedException;
import com.engsoftware.apifuncionario.validate.exceptions.FuncionarioCpfNotFoundException;

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
        String cpfInvalido = "000.000.000-00";
        when(repository.findByCpf(cpfInvalido)).thenReturn(Optional.empty());

        assertThrows(FuncionarioCpfNotFoundException.class, () -> {
            service.buscarFuncionarioPorCpf(cpfInvalido);
        });

        verify(repository).findByCpf(cpfInvalido);

    }

    @Test
    void BuscarFuncionarioExistenteporEmail(){
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.findByEmail("XKt0q@example.com")).thenReturn(Optional.of(funcionario));

        FuncionarioModel funcionarioEncontrado = service.buscarFuncionarioPorEmail("XKt0q@example.com");

        assertNotNull(funcionarioEncontrado);
        assertEquals(funcionario.getId(), funcionarioEncontrado.getId());
        assertEquals(funcionario.getCpf(), funcionarioEncontrado.getCpf());
        assertEquals(funcionario.getName(), funcionarioEncontrado.getName());
        assertEquals(funcionario.getEmail(), funcionarioEncontrado.getEmail());
        assertEquals(funcionario.getPassword(), funcionarioEncontrado.getPassword());
        assertEquals(funcionario.getSetor(), funcionarioEncontrado.getSetor());
    }

    @Test
    void ErroBuscarFuncionarioExistenteporEmail(){
        String emailInvalido = "emailInvalido";
        when(repository.findByEmail(emailInvalido)).thenReturn(Optional.empty());

        assertThrows(FuncionarioCpfNotFoundException.class, () -> {
            service.buscarFuncionarioPorEmail(emailInvalido);
        });

        verify(repository).findByEmail(emailInvalido);

    }

    @Test
    void SalvarFuncionario(){
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.save(funcionario)).thenReturn(funcionario);

        FuncionarioModel funcionarioEncontrado = service.salvarFuncionario(funcionario);

        assertNotNull(funcionarioEncontrado);
        assertEquals(funcionario.getId(), funcionarioEncontrado.getId());
        assertEquals(funcionario.getCpf(), funcionarioEncontrado.getCpf());
        assertEquals(funcionario.getName(), funcionarioEncontrado.getName());
        assertEquals(funcionario.getEmail(), funcionarioEncontrado.getEmail());
        assertEquals(funcionario.getPassword(), funcionarioEncontrado.getPassword());
        assertEquals(funcionario.getSetor(), funcionarioEncontrado.getSetor());
    }

    @Test
    void SalvarFuncionarioCpfExistente(){

        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.findByCpf(funcionario.getCpf())).thenReturn(Optional.of(funcionario));

        assertThrows(FuncionarioAlreadySavedException.class, () -> {
            service.salvarFuncionario(funcionario);
        });

        verify(repository).findByCpf(funcionario.getCpf());

    }

    @Test
    void SalvarFuncionarioEmailExistente(){
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setCpf("05460769102");
        funcionario.setName("Teste");
        funcionario.setEmail("XKt0q@example.com");
        funcionario.setPassword("12345678");
        funcionario.setSetor(Setor.TI);
        when(repository.findByEmail(funcionario.getEmail())).thenReturn(Optional.of(funcionario));

        assertThrows(FuncionarioAlreadySavedException.class, () -> {
            service.salvarFuncionario(funcionario);
        });

        verify(repository).findByEmail(funcionario.getEmail());

    }



}
