package com.volunteerhub.userservice.repository;

import com.volunteerhub.userservice.model.User;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@RefreshScope
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
