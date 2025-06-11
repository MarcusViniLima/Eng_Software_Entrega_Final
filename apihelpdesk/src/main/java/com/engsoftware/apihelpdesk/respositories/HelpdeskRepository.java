package com.engsoftware.apihelpdesk.respositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apihelpdesk.models.HelpdeskModel;

@Repository
public interface HelpdeskRepository extends JpaRepository<HelpdeskModel, UUID> {

}
