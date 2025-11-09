package com.volunteerhub.eventservice.repository;

import com.volunteerhub.common.enums.EventStatus;
import com.volunteerhub.eventservice.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByStatus(EventStatus status, PageRequest pageRequest);
}
