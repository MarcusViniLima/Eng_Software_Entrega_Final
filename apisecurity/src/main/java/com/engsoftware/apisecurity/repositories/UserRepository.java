package com.engsoftware.apisecurity.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engsoftware.apisecurity.models.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID>{

    boolean existsByEmail(String email);
    Optional<UserModel> findByEmail(String email);

}
