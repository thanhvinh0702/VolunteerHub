package com.volunteerhub.registrationservice.repository;

import com.volunteerhub.registrationservice.model.EventSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSnapshotRepository extends JpaRepository<EventSnapshot, Long> {
}
