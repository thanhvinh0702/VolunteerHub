package com.volunteerhub.userservice.repository;

import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.User;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@RefreshScope
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u.id FROM User u WHERE u.role = :role")
    List<String> findAllIdsByRole(@Param("role") Role role);
}
