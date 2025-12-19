package com.volunteerhub.communityservice.repository;

import com.volunteerhub.communityservice.model.Reaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Page<Reaction> findByPostId(Long postId, PageRequest pageRequest);
    Optional<Reaction> findByOwnerIdAndPostId(String ownerId, Long postId);
    int countByPostId(Long postId);
}
