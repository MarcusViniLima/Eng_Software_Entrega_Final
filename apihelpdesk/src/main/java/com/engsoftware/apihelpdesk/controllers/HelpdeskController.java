package com.engsoftware.apihelpdesk.controllers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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
import com.engsoftware.apihelpdesk.models.enums.Setor;
import com.engsoftware.apihelpdesk.models.enums.Status;
import com.engsoftware.apihelpdesk.respositories.HelpdeskRepository;
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
    @Autowired
    private HelpdeskRepository helpdeskRepository;

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

    @GetMapping("/status-por-departamento")
    public Map<String, Long> getStatusPorDepartamento(@RequestParam Setor setor) {
        Map<String, Long> status = new HashMap<>();
        status.put("abertos", helpdeskRepository.countBySetorAndStatus(setor, Status.ABERTO));
        status.put("em_andamento", helpdeskRepository.countBySetorAndStatus(setor, Status.EM_ANDAMENTO));
        status.put("resolvidos", helpdeskRepository.countBySetorAndStatus(setor, Status.RESOLVIDO));
        status.put("atrasados", helpdeskRepository.countBySetorAndStatus(setor, Status.ATRASO));
        return status;
    }

    @GetMapping("/contagem/tecnico")
    public Map<String, Long> getContagemChamadosPorTecnico(@RequestParam String period) {
        Map<String, Long> contagem = new HashMap<>();

        // Implementar lógica para agrupar por técnico no período
        List<HelpdeskModel> chamados = filterByPeriod(helpdeskRepository.findAll(), period);

        chamados.stream()
                .filter(c -> c.getEmailResponsavelTI() != null)
                .collect(Collectors.groupingBy(
                        HelpdeskModel::getEmailResponsavelTI,
                        Collectors.counting()))
                .forEach(contagem::put);

        return contagem;
    }

    @GetMapping("/tempo-resolucao")
    public Map<String, Double> getTempoMedioResolucao(@RequestParam String period) {
        Map<String, Double> tempos = new HashMap<>();

        // Implementar lógica para calcular tempos médios
        List<HelpdeskModel> chamados = filterByPeriod(
                helpdeskRepository.findByStatus(Status.RESOLVIDO),
                period);

        // Por departamento
        chamados.stream()
                .collect(Collectors.groupingBy(
                        HelpdeskModel::getSetor,
                        Collectors.averagingDouble(c -> Duration.between(
                                c.getDataAbertura(),
                                c.getDataEncerramento()).toHours())))
                .forEach((setor, media) -> tempos.put(setor.getSetor(), media));

        return tempos;
    }

    private List<HelpdeskModel> filterByPeriod(List<HelpdeskModel> chamados, String period) {
        LocalDate now = LocalDate.now();

        switch (period.toLowerCase()) {
            case "today":
                return chamados.stream()
                        .filter(c -> c.getDataAbertura().toLocalDate().equals(now))
                        .collect(Collectors.toList());
            case "week":
                return chamados.stream()
                        .filter(c -> c.getDataAbertura().toLocalDate().isAfter(now.minusWeeks(1)))
                        .collect(Collectors.toList());
            case "month":
                return chamados.stream()
                        .filter(c -> c.getDataAbertura().toLocalDate().isAfter(now.minusMonths(1)))
                        .collect(Collectors.toList());
            case "quarter":
                return chamados.stream()
                        .filter(c -> c.getDataAbertura().toLocalDate().isAfter(now.minusMonths(3)))
                        .collect(Collectors.toList());
            default:
                return chamados;
        }
    }
}
