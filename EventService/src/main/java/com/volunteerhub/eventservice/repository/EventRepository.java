package com.volunteerhub.eventservice.repository;

import com.volunteerhub.common.enums.EventStatus;
import com.volunteerhub.eventservice.model.Event;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findById(Long Id);
    Page<Event> findByStatus(EventStatus status, PageRequest pageRequest);

    @Query("SELECT COUNT(*) FROM Event")
    public Long countEvents();

    int countById();

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.address")
    List<Event> findAllForExport();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.ownerId = :ownerId")
    Long countEventsByOwnerId(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.ownerId = :ownerId AND e.status = :status")
    Long countByOwnerIdAndStatus(@Param("ownerId") String ownerId, @Param("status") EventStatus status);
}
