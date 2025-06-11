package com.engsoftware.apihelpdesk.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.engsoftware.apihelpdesk.models.ComentarioModel;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.services.ComentarioService;
import com.engsoftware.apihelpdesk.services.HelpdeskService;

@RestController("/helpdesk")
public class HelpdeskController {

     @Autowired
     private HelpdeskService helpdeskService;
     @Autowired
     private ComentarioService comentarioService;

    @GetMapping
    public Iterable<HelpdeskModel> findAll() {
        return helpdeskService.findAll();
    }

    @GetMapping("/comentarios")
    public Iterable<ComentarioModel> findAllComentarios(@RequestBody HelpdeskModel helpdeskModel) {
        return comentarioService.findAll(helpdeskModel.getId());
    }

    @PostMapping
    public HelpdeskModel save(@RequestBody HelpdeskModel helpdeskModel) {
        return helpdeskService.save(helpdeskModel);
    }

    @PostMapping("/comentario")
    public ComentarioModel saveComentario(@RequestBody ComentarioModel comentarioModel) {
        return comentarioService.save(comentarioModel);
    }

    @PutMapping
    public HelpdeskModel update(@RequestBody HelpdeskModel helpdeskModel) {
        return helpdeskService.update(helpdeskModel);
    }

    
     

}
