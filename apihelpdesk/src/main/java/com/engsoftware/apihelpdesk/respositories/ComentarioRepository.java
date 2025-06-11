package com.engsoftware.apihelpdesk.respositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apihelpdesk.models.ComentarioModel;

@Repository
public interface ComentarioRepository extends JpaRepository<ComentarioModel, UUID> {

    List<ComentarioModel> findByHelpdesk(UUID helpdesk);

    
}
