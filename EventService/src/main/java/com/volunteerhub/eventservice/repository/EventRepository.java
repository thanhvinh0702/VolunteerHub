package com.volunteerhub.eventservice.repository;

import com.volunteerhub.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
