package com.engsoftware.apihelpdesk.respositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.models.enums.Setor;
import com.engsoftware.apihelpdesk.models.enums.Status;

@Repository
public interface HelpdeskRepository extends JpaRepository<HelpdeskModel, UUID> {
    List<HelpdeskModel> findByEmailUsername(String emailUsername);
    List<HelpdeskModel> findByEmailResponsavelTI(String emailResponsavel);
    long countByStatus(Status status);
    long countBySetor(Setor setor);

}
