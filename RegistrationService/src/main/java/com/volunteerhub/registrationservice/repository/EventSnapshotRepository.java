package com.volunteerhub.registrationservice.repository;

import com.volunteerhub.registrationservice.model.EventSnapshot;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSnapshotRepository extends JpaRepository<EventSnapshot, Long> {
    @Query("SELECT SUM(es.capacity) FROM EventSnapshot es WHERE es.ownerId = :ownerId")
    public Long findCapacityPerManager(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(*) FROM EventSnapshot es WHERE es.ownerId = :ownerId")
    public Long countEventPerManager(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(es) FROM EventSnapshot es WHERE es.ownerId = :ownerId AND es.status = 'ACTIVE'")
    public Long countActiveSnapshots(@Param("ownerId") String ownerId);
}
