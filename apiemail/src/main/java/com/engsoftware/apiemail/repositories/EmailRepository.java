package com.engsoftware.apiemail.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apiemail.models.EmailModel;

@Repository
public interface EmailRepository extends JpaRepository<EmailModel, UUID> {

}
