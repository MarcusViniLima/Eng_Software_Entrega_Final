package com.engsoftware.apihelpdesk.controllers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.engsoftware.apihelpdesk.exception.FileNotFoundException;
import com.engsoftware.apihelpdesk.models.ComentarioModel;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.models.enums.Status;
import com.engsoftware.apihelpdesk.services.ComentarioService;
import com.engsoftware.apihelpdesk.services.FileStorageService;
import com.engsoftware.apihelpdesk.services.HelpdeskService;

@RestController
@RequestMapping("/helpdesk")
public class HelpdeskController {

    @Autowired
    private HelpdeskService helpdeskService;
    @Autowired
    private ComentarioService comentarioService;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<HelpdeskModel> findAll() {
        return helpdeskService.findAll();
    }

    @GetMapping("/{id}")
    public HelpdeskModel findById(@PathVariable UUID id) {
        return helpdeskService.findById(id);
    }

    @GetMapping("/criador/{email}")
    public List<HelpdeskModel> findByCriador(@PathVariable String email) {
        return helpdeskService.findByCriador(email);
    }

    @GetMapping("/tecnico/{email}")
    public List<HelpdeskModel> findByTecnico(@PathVariable String email) {
        return helpdeskService.findByTecnico(email);
    }

    @PostMapping
    public HelpdeskModel save(@RequestBody HelpdeskModel helpdeskModel) {
        return helpdeskService.save(helpdeskModel);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HelpdeskModel editarChamadoComArquivo(
            @PathVariable UUID id,
            @RequestPart HelpdeskModel helpdeskModel,
            @RequestPart(required = false) MultipartFile file) {

        HelpdeskModel chamadoExistente = helpdeskService.findById(id);

        if (chamadoExistente.getStatus() != Status.ABERTO) {
            throw new IllegalStateException("Chamado só pode ser editado quando está com status ABERTO");
        }

        HelpdeskModel chamadoAtualizado = helpdeskService.update(helpdeskModel);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(chamadoAtualizado, file);
            chamadoAtualizado.setFileName(fileName);
            chamadoAtualizado = helpdeskService.save(chamadoAtualizado);
        }

        return chamadoAtualizado;
    }

    @PutMapping("/atribuir/{id}")
    public HelpdeskModel atribuirTecnico(@PathVariable UUID id, @RequestParam String tecnico) {
        return helpdeskService.atribuirTecnico(id, tecnico);
    }

    @PutMapping("/status/{id}")
    public HelpdeskModel alterarStatus(@PathVariable UUID id, @RequestParam Status status) {
        return helpdeskService.alterarStatus(id, status);
    }

    @GetMapping("/contagem/status")
    public Map<String, Long> getContagemChamadosPorStatus() {
        Map<String, Long> contagem = new HashMap<>();
        contagem.put("resolvidos", helpdeskService.contarChamadosResolvidos());
        contagem.put("abertos", helpdeskService.contarChamadosAbertos());
        contagem.put("atrasados", helpdeskService.contarChamadosAtrasados());
        contagem.put("em_andamento", helpdeskService.contarChamadosEmAndamento());
        return contagem;
    }

    @GetMapping("/contagem/setor")
    public Map<String, Long> getContagemChamadosPorSetor() {
        Map<String, Long> contagem = new HashMap<>();
        contagem.put("financeiro", helpdeskService.contarChamadosFinanceiro());
        contagem.put("marketing", helpdeskService.contarChamadosMarketing());
        contagem.put("rh", helpdeskService.contarChamadosRH());
        contagem.put("ti", helpdeskService.contarChamadosTI());

        return contagem;
    }

    @PostMapping("/{id}/comentario")
    public ComentarioModel saveComentario(@PathVariable UUID id, @RequestBody ComentarioModel comentarioModel) {
        HelpdeskModel chamado = helpdeskService.findById(id);
        comentarioModel.setDataComentario(LocalDateTime.now());
        comentarioModel.setHelpdesk(chamado);
        return comentarioService.save(comentarioModel);
    }

    @GetMapping("/{id}/comentarios")
    public List<ComentarioModel> findAllComentarios(@PathVariable UUID id) {
        return comentarioService.findAll(id);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFileStorageLocation().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new FileNotFoundException("Arquivo não encontrado: " + fileName);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Erro ao baixar o arquivo", ex);
        }
    }

    @PutMapping("/{id}/cancelar")
    public HelpdeskModel cancelarChamado(@PathVariable UUID id) {
        return helpdeskService.cancelarChamado(id);
    }
}
