package com.volunteerhub.userservice.repository;

import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.userservice.model.User;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@RefreshScope
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u.id FROM User u WHERE u.role = :role")
    List<String> findAllIdsByRole(@Param("role") UserRole role);

    @Query("""
    select u from User u
    left join fetch u.address
    where u.id in :userIds
    """)
    List<User> findAllByIds(@Param("userIds") List<String> userIds);
}
