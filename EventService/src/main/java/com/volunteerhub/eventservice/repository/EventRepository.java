package com.volunteerhub.EventService.repository;

import com.volunteerhub.EventService.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
