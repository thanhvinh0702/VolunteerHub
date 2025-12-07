package com.volunteerhub.eventservice.repository;

import com.volunteerhub.eventservice.model.Event;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    @EntityGraph(attributePaths = { "category", "address" })
    List<Event> findByIdIn(List<Long> ids);

    @EntityGraph(attributePaths = { "category", "address" })
    Page<Event> findAllByOwnerId(String ownerId, PageRequest pageRequest);

    @Query(value = "SELECT * FROM event e " +
            "WHERE e.name ~* :keyword OR e.description ~* :keyword", countQuery = "SELECT COUNT(*) FROM event e " +
                    "WHERE e.name ~* :keyword OR e.description ~* :keyword", nativeQuery = true)
    Page<Event> searchEventsByRegex(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.address")
    List<Event> findAllForExport();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.ownerId = :ownerId")
    Long countEventsByOwnerId(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.ownerId = :ownerId AND e.status = :status")
    Long countByOwnerIdAndStatus(@Param("ownerId") String ownerId, @Param("status") EventStatus status);
}
