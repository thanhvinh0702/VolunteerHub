package com.volunteerhub.eventservice.repository;

import com.volunteerhub.common.enums.EventStatus;
import com.volunteerhub.eventservice.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    @EntityGraph(attributePaths = {"category", "address"})
    List<Event> findByIdIn(List<Long> ids);

    @EntityGraph(attributePaths = {"category", "address"})
    Page<Event> findByStatus(EventStatus status, PageRequest pageRequest);

    @EntityGraph(attributePaths = {"category", "address"})
    Page<Event> findAllByOwnerId(String ownerId, PageRequest pageRequest);
}
