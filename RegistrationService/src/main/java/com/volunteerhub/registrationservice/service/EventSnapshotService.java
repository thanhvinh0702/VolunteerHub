package com.volunteerhub.registrationservice.service;

import com.volunteerhub.registrationservice.dto.EventSnapshotRequest;
import com.volunteerhub.registrationservice.model.EventSnapshot;
import com.volunteerhub.registrationservice.repository.EventSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EventSnapshotService {

    private final EventSnapshotRepository eventSnapshotRepository;

    public EventSnapshot findEntityById(Long id) {
        return eventSnapshotRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Event snapshot with id " + id + " does not exist."));
    }

    public void create(EventSnapshotRequest eventSnapshotRequest) {
        EventSnapshot eventSnapshot = EventSnapshot
                .builder()
                .eventId(eventSnapshotRequest.getEventId())
                .capacity(eventSnapshotRequest.getCapacity())
                .status(eventSnapshotRequest.getStatus())
                .ownerId(eventSnapshotRequest.getOwnerId())
                .build();
        eventSnapshotRepository.save(eventSnapshot);
    }

    public void update(EventSnapshotRequest eventSnapshotRequest) {
        EventSnapshot eventSnapshot = findEntityById(eventSnapshotRequest.getEventId());
        if (eventSnapshotRequest.getStatus() != null) {
            eventSnapshot.setStatus(eventSnapshotRequest.getStatus());
        }
        if (eventSnapshotRequest.getCapacity() != null) {
            eventSnapshot.setCapacity(eventSnapshotRequest.getCapacity());
        }
        eventSnapshotRepository.save(eventSnapshot);
    }

    public void delete(Long eventSnapshotId) {
        EventSnapshot eventSnapshot = findEntityById(eventSnapshotId);
        eventSnapshotRepository.delete(eventSnapshot);
    }

    public Long countEventPerManager(String ownerId) {
        return eventSnapshotRepository.countEventPerManager(ownerId);
    }

    public Long countEventActivePerManager(String ownerId) {
        return eventSnapshotRepository.countActiveSnapshots(ownerId);
    }

}
