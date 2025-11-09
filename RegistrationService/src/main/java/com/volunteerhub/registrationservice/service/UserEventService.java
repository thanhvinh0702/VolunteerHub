package com.volunteerhub.registrationservice.service;

import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.common.utils.PageNumAndSizeResponse;
import com.volunteerhub.common.utils.PaginationValidation;
import com.volunteerhub.registrationservice.dto.UserEventRequest;
import com.volunteerhub.registrationservice.dto.UserEventResponse;
import com.volunteerhub.registrationservice.mapper.UserEventMapper;
import com.volunteerhub.registrationservice.model.EventSnapshot;
import com.volunteerhub.registrationservice.model.UserEvent;
import com.volunteerhub.registrationservice.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserEventService {

    private final UserEventRepository userEventRepository;
    private final EventSnapshotService eventSnapshotService;
    private final UserEventMapper userEventMapper;

    public UserEvent findEntityByUserIdAndEventId(String userId, Long eventId) {
        return userEventRepository.findByUserIdAndEventId(userId, eventId).orElseThrow(() ->
                new NoSuchElementException("User-event registration with user id " + userId + " and event id " + eventId + " does not exits"));
    }

    public Long getCurrentParticipantCount(Long eventId) {
        return userEventRepository.countByEventIdAndStatus(eventId, UserEventStatus.APPROVED);
    }

    public Long getCurrentRegistrationCount(Long eventId) {
        return userEventRepository.countByEventId(eventId);
    }

    public List<UserEventResponse> findByUserId(String userId, UserEventStatus status, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSizeResponse = PaginationValidation.validate(pageNum, pageSize);
        if (status != null) {
            return userEventRepository.findByUserIdAndStatus(userId,
                            status,
                            PageRequest.of(pageNumAndSizeResponse.getPageNum(), pageNumAndSizeResponse.getPageSize()))
                    .getContent()
                    .stream().map(userEventMapper::toResponseDto)
                    .toList();
        }
        return userEventRepository.findByUserId(userId, PageRequest.of(pageNumAndSizeResponse.getPageNum(), pageNumAndSizeResponse.getPageSize()))
                .getContent()
                .stream().map(userEventMapper::toResponseDto)
                .toList();
    }

    @PreAuthorize("hasRole('MANAGER')")
    public List<UserEventResponse> findByEventId(String userId, Long eventId, UserEventStatus status, Integer pageNum, Integer pageSize) {
        EventSnapshot eventSnapshot = eventSnapshotService.findEntityById(eventId);
        if (!eventSnapshot.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to read registration of event with id " + eventId);
        }
        PageNumAndSizeResponse pageNumAndSizeResponse = PaginationValidation.validate(pageNum, pageSize);
        if (status != null) {
            return userEventRepository.findByEventIdAndStatus(eventId,
                    status,
                    PageRequest.of(pageNumAndSizeResponse.getPageNum(), pageNumAndSizeResponse.getPageSize()))
                    .getContent()
                    .stream().map(userEventMapper::toResponseDto)
                    .toList();
        }
        return userEventRepository.findByEventId(eventId, PageRequest.of(pageNumAndSizeResponse.getPageNum(), pageNumAndSizeResponse.getPageSize()))
                .getContent()
                .stream().map(userEventMapper::toResponseDto)
                .toList();
    }

    // TODO: publish event to notify owner of event
    public UserEventResponse registerUserEvent(String userId, Long eventId) {
        UserEvent userEvent = UserEvent.builder()
                .userId(userId)
                .eventId(eventId)
                .build();
        return userEventMapper.toResponseDto(userEventRepository.save(userEvent));
    }

    // TODO: publish event to notify user
    @PreAuthorize("hasRole('MANAGER')")
    public UserEventResponse reviewUserEventRegistrationRequest(String userId, String participantId, Long eventId, UserEventRequest request) {
        UserEvent userEvent = findEntityByUserIdAndEventId(participantId, eventId);
        EventSnapshot eventSnapshot = eventSnapshotService.findEntityById(eventId);
        if (!eventSnapshot.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to review user's request to event with id " + eventId);
        }

        switch (request.getStatus()) {
            case APPROVED -> approveUserEvent(userEvent, eventSnapshot);
            case REJECTED -> rejectUserEvent(userEvent, request.getNote());
            case COMPLETED -> completeUserEvent(userEvent, request.getNote());
            default -> throw new IllegalArgumentException("Unsupported status: " + request.getStatus());
        }

        return userEventMapper.toResponseDto(userEventRepository.save(userEvent));
    }

    private void approveUserEvent(UserEvent userEvent, EventSnapshot snapshot) {
        if (getCurrentParticipantCount(userEvent.getEventId()) + 1 > snapshot.getCapacity()) {
            throw new IllegalArgumentException("Event capacity reached");
        }
        userEvent.setStatus(UserEventStatus.APPROVED);
        userEvent.setReviewedAt(LocalDateTime.now());
    }

    private void rejectUserEvent(UserEvent userEvent, String note) {
        userEvent.setStatus(UserEventStatus.REJECTED);
        userEvent.setNote(note);
        userEvent.setReviewedAt(LocalDateTime.now());
    }

    private void completeUserEvent(UserEvent userEvent, String note) {
        userEvent.setStatus(UserEventStatus.COMPLETED);
        userEvent.setNote(note);
        userEvent.setCompletedAt(LocalDateTime.now());
    }

    // TODO: publish event to notify user
    @PreAuthorize("hasRole('MANAGER')")
    public UserEventResponse deleteUserEventRegistrationRequest(String userId, String participantId, Long eventId) {
        UserEvent userEvent = findEntityByUserIdAndEventId(participantId, eventId);
        EventSnapshot eventSnapshot = eventSnapshotService.findEntityById(eventId);
        if (!eventSnapshot.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to delete user's request to event with id " + eventId);
        }
        userEventRepository.delete(userEvent);
        return userEventMapper.toResponseDto(userEvent);
    }
}
