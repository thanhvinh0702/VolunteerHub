package com.volunteerhub.eventservice.repository;

import com.volunteerhub.eventservice.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    @EntityGraph(attributePaths = {"category", "address"})
    List<Event> findByIdIn(List<Long> ids);

    @EntityGraph(attributePaths = {"category", "address"})
    Page<Event> findAllByOwnerId(String ownerId, PageRequest pageRequest);

    @Query(
            value = "SELECT * FROM event e " +
                    "WHERE e.name ~* :keyword OR e.description ~* :keyword",
            countQuery = "SELECT COUNT(*) FROM event e " +
                    "WHERE e.name ~* :keyword OR e.description ~* :keyword",
            nativeQuery = true
    )
    Page<Event> searchEventsByRegex(@Param("keyword") String keyword, Pageable pageable);

}
