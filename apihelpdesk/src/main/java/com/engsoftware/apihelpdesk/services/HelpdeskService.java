package com.engsoftware.apihelpdesk.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.respositories.HelpdeskRepository;

@Service
public class HelpdeskService {

    @Autowired
    private HelpdeskRepository helpdeskRepository;

    public HelpdeskModel save(HelpdeskModel helpdeskModel) {
        return helpdeskRepository.save(helpdeskModel);
    }

    public HelpdeskModel findById(UUID id) {
        return helpdeskRepository.findById(id).get();
    }

    public void delete(HelpdeskModel helpdeskModel) {
        helpdeskRepository.delete(helpdeskModel);
    }

    public Iterable<HelpdeskModel> findAll() {
        return helpdeskRepository.findAll();
    }

    public HelpdeskModel update(HelpdeskModel helpdeskModel) {
        return helpdeskRepository.save(helpdeskModel);
    }

}
