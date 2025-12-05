package com.volunteerhub.eventservice.repository;

import com.volunteerhub.common.enums.EventStatus;
import com.volunteerhub.eventservice.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    @EntityGraph(attributePaths = {"category", "address"})
    List<Event> findByIdIn(List<Long> ids);

    @EntityGraph(attributePaths = {"category", "address"})
    Page<Event> findByStatus(EventStatus status, PageRequest pageRequest);

    @EntityGraph(attributePaths = {"category", "address"})
    Page<Event> findAllByOwnerId(String ownerId, PageRequest pageRequest);

    @Query(value = "SELECT * FROM events e WHERE " +
            "e.name REGEXP :keyword OR e.description REGEXP :keyword",
            nativeQuery = true)
    Page<Event> searchEventsByRegex(@Param("keyword") String keyword, Pageable pageable);
}
