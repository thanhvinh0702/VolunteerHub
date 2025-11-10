package com.volunteerhub.registrationservice.repository;

import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.registrationservice.model.UserEvent;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEventRepository extends JpaRepository<UserEvent, Long> {

    Optional<UserEvent> findByUserIdAndEventId(String userId, Long eventId);
    Page<UserEvent> findByUserId(String userId, PageRequest pageRequest);
    Page<UserEvent> findByEventId(Long eventId, PageRequest pageRequest);
    Page<UserEvent> findByUserIdAndStatus(String userId, UserEventStatus status, PageRequest pageRequest);
    Page<UserEvent> findByEventIdAndStatus(Long eventId, UserEventStatus status, PageRequest pageRequest);
    Long countByEventIdAndStatus(Long eventId, UserEventStatus status);
    Long countByEventId(Long eventId);
    @Query("SELECT ue.userId FROM UserEvent ue WHERE ue.eventId = :eventId AND ue.status IN ('APPROVED', 'COMPLETED')")
    List<String> findAllUserIdsByEventId(@Param("eventId") Long eventId);
}
