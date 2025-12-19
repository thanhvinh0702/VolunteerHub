package com.volunteerhub.communityservice.repository;

import com.volunteerhub.communityservice.model.Reaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Page<Reaction> findByPostId(Long postId, PageRequest pageRequest);
    Optional<Reaction> findByOwnerIdAndPostId(String ownerId, Long postId);
    int countByPostId(Long postId);

    @Query("SELECT COUNT(r) FROM Reaction r " +
            "WHERE r.post.eventId = :eventId " +
            "AND r.createdAt BETWEEN :startDate AND :endDate")
    long countByEventIdAndDateRange(@Param("eventId") Long eventId,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
}
