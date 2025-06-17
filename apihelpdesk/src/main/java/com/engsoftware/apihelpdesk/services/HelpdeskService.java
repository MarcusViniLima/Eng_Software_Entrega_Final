package com.engsoftware.apihelpdesk.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.models.enums.Setor;
import com.engsoftware.apihelpdesk.models.enums.Status;
import com.engsoftware.apihelpdesk.respositories.HelpdeskRepository;

@Service
public class HelpdeskService {

    @Autowired
    private HelpdeskRepository helpdeskRepository;

    public HelpdeskModel save(HelpdeskModel helpdeskModel) {
        if (helpdeskModel.getDataAbertura() == null) {
            helpdeskModel.setDataAbertura(LocalDateTime.now());
        }
        return helpdeskRepository.save(helpdeskModel);
    }

    public HelpdeskModel findById(UUID id) {
        return helpdeskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));
    }

    public void delete(HelpdeskModel helpdeskModel) {
        helpdeskRepository.delete(helpdeskModel);
    }

    public List<HelpdeskModel> findAll() {
        return helpdeskRepository.findAll();
    }

    public HelpdeskModel update(HelpdeskModel helpdeskModel) {
        HelpdeskModel existente = findById(helpdeskModel.getId());

        if (existente.getStatus() != Status.ABERTO) {
            throw new IllegalStateException("Só é possível editar chamados abertos");
        }

        helpdeskModel.setEmailUsername(existente.getEmailUsername());
        helpdeskModel.setDataAbertura(existente.getDataAbertura());
        helpdeskModel.setStatus(existente.getStatus());

        return helpdeskRepository.save(helpdeskModel);
    }

    public List<HelpdeskModel> findByCriador(String emailUsername) {
        return helpdeskRepository.findByEmailUsername(emailUsername);
    }

    public List<HelpdeskModel> findByTecnico(String emailResponsavel) {
        return helpdeskRepository.findByEmailResponsavelTI(emailResponsavel);
    }

    public HelpdeskModel atribuirTecnico(UUID id, String emailTecnico) {
        HelpdeskModel chamado = findById(id);
        if (chamado.getStatus() == Status.ABERTO) {
            chamado.setEmailResponsavelTI(emailTecnico);
            chamado.setStatus(Status.EM_ANDAMENTO);
            return helpdeskRepository.save(chamado);
        }
        throw new IllegalStateException("Chamado não está aberto para atribuição");
    }

    public HelpdeskModel alterarStatus(UUID id, Status novoStatus) {
        HelpdeskModel chamado = findById(id);

        if (novoStatus == Status.RESOLVIDO) {
            chamado.setDataEncerramento(LocalDateTime.now());
        } else if (chamado.getStatus() == Status.EM_ANDAMENTO && novoStatus != Status.RESOLVIDO) {
            LocalDateTime dataLimite = calcularDataLimite(chamado);
            if (LocalDateTime.now().isAfter(dataLimite)) {
                chamado.setStatus(Status.ATRASO);
                return helpdeskRepository.save(chamado);
            }
        }

        chamado.setStatus(novoStatus);
        return helpdeskRepository.save(chamado);
    }

    private LocalDateTime calcularDataLimite(HelpdeskModel chamado) {
        int horasParaAtraso = switch (chamado.getPrioridade()) {
            case BAIXA -> 8;
            case MEDIA, ALTA -> 2;
        };
        return chamado.getDataAbertura().plusHours(horasParaAtraso);
    }

    public long contarChamadosPorStatus(Status status) {
        return helpdeskRepository.countByStatus(status);
    }

    public long contarChamadosResolvidos() {
        return helpdeskRepository.countByStatus(Status.RESOLVIDO);
    }

    public long contarChamadosAbertos() {
        return helpdeskRepository.countByStatus(Status.ABERTO);
    }

    public long contarChamadosAtrasados() {
        return helpdeskRepository.countByStatus(Status.ATRASO);
    }

    public long contarChamadosEmAndamento() {
        return helpdeskRepository.countByStatus(Status.EM_ANDAMENTO);
    }

    public long contarChamadosPorSetor(Setor setor) {
        return helpdeskRepository.countBySetor(setor);
    }

    public long contarChamadosTI() {
        return helpdeskRepository.countBySetor(Setor.TI);
    }

    public long contarChamadosRH() {
        return helpdeskRepository.countBySetor(Setor.RH);
    }

    public long contarChamadosFinanceiro() {
        return helpdeskRepository.countBySetor(Setor.FINANCEIRO);
    }

    public long contarChamadosMarketing() {
        return helpdeskRepository.countBySetor(Setor.MARKETING);
    }

    public long contarChamadosVendas() {
        return helpdeskRepository.countBySetor(Setor.VENDAS);
    }

    public HelpdeskModel cancelarChamado(UUID id) {
        HelpdeskModel chamado = findById(id);
        if (chamado.getStatus() == Status.RESOLVIDO || chamado.getStatus() == Status.CANCELADO) {
            throw new IllegalStateException("Chamado já está finalizado ou cancelado");
        }

        chamado.setStatus(Status.CANCELADO);
        chamado.setDataEncerramento(LocalDateTime.now());
        return helpdeskRepository.save(chamado);
    }

}
