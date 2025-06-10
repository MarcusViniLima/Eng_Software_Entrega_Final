package com.engsoftware.apihelpdesk.respositories;

import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.engsoftware.apihelpdesk.models.HelpdeskModel;

@Repository
public interface HelpdeskRepository extends JPARepository<HelpdeskModel, UUID> {

}
