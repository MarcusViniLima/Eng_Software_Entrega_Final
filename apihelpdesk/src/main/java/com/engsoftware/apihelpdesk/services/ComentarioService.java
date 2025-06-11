package com.engsoftware.apihelpdesk.services;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
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
        return comentarioRepository.save(comentarioModel);
    }

    public Queue<ComentarioModel> findAll(UUID helpdeskId) {
         List<ComentarioModel> comentarios = comentarioRepository.findByHelpdesk(helpdeskId);
        return new LinkedList<>(comentarios);
    }

}
