package com.engsoftware.apihelpdesk.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engsoftware.apihelpdesk.models.ComentarioModel;
import com.engsoftware.apihelpdesk.respositories.ComentarioRepository;


@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    public ComentarioModel save(ComentarioModel comentarioModel) {
        if (comentarioModel.getDataComentario() == null) {
            comentarioModel.setDataComentario(LocalDateTime.now());
        }
        return comentarioRepository.save(comentarioModel);
    }

    public List<ComentarioModel> findAll(UUID helpdeskId) {
        return comentarioRepository.findByHelpdesk(helpdeskId);
    }

}
