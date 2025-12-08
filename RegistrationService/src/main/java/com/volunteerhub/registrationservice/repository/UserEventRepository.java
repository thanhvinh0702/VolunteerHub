package com.volunteerhub.registrationservice.repository;

import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.registrationservice.model.UserEvent;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
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

    @Query("SELECT ue.userId FROM UserEvent ue WHERE ue.eventId = :eventId AND ue.status IN ('APPROVED', 'COMPLETED')")
    List<String> findAllUserIdsByEventId(@Param("eventId") Long eventId, PageRequest pageRequest);

    @Query("SELECT ue.eventId AS eventId, COUNT(ue) AS statusCount " +
            "FROM UserEvent ue " +
            "WHERE ue.status IN :status AND ue.eventId IN :eventIds " +
            "GROUP BY ue.eventId")
    List<Object[]> getEventRegistrationCount(@Param("eventIds") List<Long> eventIds,
                                             @Param("status") List<UserEventStatus> status);

    @Query("SELECT ue.eventId AS eventId, COUNT(ue) AS statusCount " +
            "FROM UserEvent ue " +
            "WHERE ue.status in :statuses " +
            "AND ue.createdAt >= COALESCE(:from, ue.createdAt) " +
            "AND ue.createdAt <= COALESCE(:to, ue.createdAt) " +
            "GROUP BY ue.eventId")
    List<Object[]> getAllEventRegistrationCount(@Param("statuses") List<UserEventStatus> statuses,
                                                @Param("from") LocalDateTime from,
                                                @Param("to") LocalDateTime to,
                                                PageRequest pageRequest);

    Page<UserEvent> findByEventIdInAndStatus(List<Long> eventIds, UserEventStatus status, Pageable pageable);

    Page<UserEvent> findByEventIdIn(List<Long> eventIds, Pageable pageable);

    @Query("SELECT ue FROM UserEvent ue " +
            "JOIN ue.eventSnapshot es " +
            "WHERE es.ownerId = :ownerId " +
            "AND (:#{#eventId} IS NULL OR ue.eventId = :#{#eventId}) " +
            "AND (:#{#status} IS NULL OR ue.status = :#{#status})")
    Page<UserEvent> findAllByOwnerId(
            @Param("ownerId") String ownerId,
            @Param("eventId") Long eventId,
            @Param("status") UserEventStatus status,
            Pageable pageable
    );

    @Query("SELECT ue FROM UserEvent ue WHERE ue.eventId = :eventId AND ue.status IN :statuses")
    List<UserEvent> findAllByEventIdAndStatus(
            @Param("eventId") Long eventId,
            @Param("statuses") List<UserEventStatus> statuses
    );

    @Query("SELECT ue FROM UserEvent ue WHERE ue.eventId = :eventId AND ue.status IN :statuses")
    Page<UserEvent> findAllByEventIdAndStatuses(
            @Param("eventId") Long eventId,
            @Param("statuses") List<UserEventStatus> statuses,
            Pageable pageable
    );

    @Query("""
    SELECT COUNT(ue.id)
    FROM UserEvent ue
    JOIN EventSnapshot es ON ue.eventId = es.eventId
    WHERE es.ownerId = :ownerId
""")
    Long countApplicationsByOwnerId(@Param("ownerId") String ownerId);

    @Query("""
    SELECT COUNT(ue.id)
    FROM UserEvent ue
    JOIN EventSnapshot es ON ue.eventId = es.eventId
    WHERE es.ownerId = :ownerId
      AND ue.status = 'APPROVED'
""")
    Long countApprovedByOwnerId(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(u) FROM UserEvent u WHERE u.userId = :userId AND u.status IN :statuses")
    Long countUserEventsByStatuses(@Param("userId") String userId, @Param("statuses") Collection<UserEventStatus> statuses);

}
