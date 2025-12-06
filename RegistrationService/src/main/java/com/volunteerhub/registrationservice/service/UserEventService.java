package com.volunteerhub.registrationservice.service;

import com.volunteerhub.common.dto.EventRegistrationCount;
import com.volunteerhub.common.dto.RegistrationResponse;
import com.volunteerhub.common.dto.UserEventResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.common.utils.PageNumAndSizeResponse;
import com.volunteerhub.common.utils.PaginationValidation;
import com.volunteerhub.registrationservice.dto.UserEventRequest;
import com.volunteerhub.registrationservice.dto.UserEventResponse;
import com.volunteerhub.registrationservice.mapper.UserEventMapper;
import com.volunteerhub.registrationservice.model.EventSnapshot;
import com.volunteerhub.registrationservice.model.UserEvent;
import com.volunteerhub.registrationservice.publisher.RegistrationPublisher;
import com.volunteerhub.registrationservice.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserEventService {

    private final UserEventRepository userEventRepository;
    private final EventSnapshotService eventSnapshotService;
    private final UserEventMapper userEventMapper;
    private final RegistrationPublisher registrationPublisher;

    public UserEvent findEntityByUserIdAndEventId(String userId, Long eventId) {
        return userEventRepository.findByUserIdAndEventId(userId, eventId).orElseThrow(() ->
                new NoSuchElementException("User-event registration with user id " + userId + " and event id " + eventId + " does not exits"));
    }

    public Long getCurrentParticipantCount(Long eventId) {
        return userEventRepository.countByEventIdAndStatus(eventId, UserEventStatus.APPROVED);
    }

    public List<EventRegistrationCount> getEventsParticipantCount(List<Long> eventIds) {
        List<Object[]> registrationCountRows = userEventRepository.getEventRegistrationCount(eventIds, UserEventStatus.APPROVED);
        List<Object[]> participantCountRows = userEventRepository.getEventRegistrationCount(eventIds, UserEventStatus.PENDING);
        Map<Long, EventRegistrationCount> map = new HashMap<>();
        for (Object[] row : registrationCountRows) {
            Long eventId = (Long) row[0];
            Long count = (Long) row[1];
            map.put(eventId, EventRegistrationCount.builder()
                    .eventId(eventId)
                    .registrationCount(count)
                    .participantCount(0L)
                    .build());
        }
        for (Object[] row : participantCountRows) {
            Long eventId = (Long) row[0];
            Long count = (Long) row[1];
            map.compute(eventId, (id, dto) -> {
                if (dto == null) {
                    return EventRegistrationCount.builder()
                            .eventId(eventId)
                            .registrationCount(0L)
                            .participantCount(count)
                            .build();
                } else {
                    dto.setParticipantCount(count);
                    return dto;
                }
            });
        }
        return new ArrayList<>(map.values());
    }

    public List<EventRegistrationCount> getAllEventsParticipantCount(Integer pageNum, Integer pageSize, LocalDateTime from, LocalDateTime to) {
        PageNumAndSizeResponse pageNumAndSizeResponse = PaginationValidation.validate(pageNum, pageSize);
        PageRequest pageRequest = PageRequest.of(
                pageNumAndSizeResponse.getPageNum(),
                pageNumAndSizeResponse.getPageSize(),
                Sort.by("statusCount").descending()
        );
        List<Object[]> registrationCountRows = userEventRepository.getAllEventRegistrationCount(UserEventStatus.APPROVED, from, to, pageRequest);
        List<Object[]> participantCountRows = userEventRepository.getAllEventRegistrationCount(UserEventStatus.PENDING, from, to, pageRequest);
        Map<Long, EventRegistrationCount> map = new HashMap<>();
        for (Object[] row : registrationCountRows) {
            Long eventId = (Long) row[0];
            Long count = (Long) row[1];
            map.put(eventId, EventRegistrationCount.builder()
                    .eventId(eventId)
                    .registrationCount(count)
                    .participantCount(0L)
                    .build());
        }
        for (Object[] row : participantCountRows) {
            Long eventId = (Long) row[0];
            Long count = (Long) row[1];
            map.compute(eventId, (id, dto) -> {
                if (dto == null) {
                    return EventRegistrationCount.builder()
                            .eventId(eventId)
                            .registrationCount(0L)
                            .participantCount(count)
                            .build();
                } else {
                    dto.setParticipantCount(count);
                    return dto;
                }
            });
        }
        return new ArrayList<>(map.values());
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

    public List<String> findUserIdsByEventId(String userId, Long eventId, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSizeResponse = PaginationValidation.validate(pageNum, pageSize);
        return userEventRepository.findAllUserIdsByEventId(eventId,
                        PageRequest.of(pageNumAndSizeResponse.getPageNum(), pageNumAndSizeResponse.getPageSize()));
    }

    @PreAuthorize("hasRole('SYSTEM')")
    public List<String> findUserIdsByEventId(Long eventId) {
        return userEventRepository.findAllUserIdsByEventId(eventId);
    }

    public Boolean isParticipant(String userId, Long eventId) {
        try {
            UserEvent userEvent = findEntityByUserIdAndEventId(userId, eventId);
            return userEvent.getStatus().equals(UserEventStatus.APPROVED) || userEvent.getStatus().equals(UserEventStatus.COMPLETED);
        } catch (Exception e) {
            return false;
        }
    }

    public UserEventResponse registerUserEvent(String userId, Long eventId) {
        EventSnapshot eventSnapshot = eventSnapshotService.findEntityById(eventId);
        UserEvent userEvent = UserEvent.builder()
                .userId(userId)
                .eventId(eventId)
                .eventSnapshot(eventSnapshot)
                .build();
        UserEvent savedUserEvent = userEventRepository.save(userEvent);
        registrationPublisher.publishEvent(userEventMapper.toCreatedMessage(userEvent, eventSnapshot.getOwnerId()));
        return userEventMapper.toResponseDto(savedUserEvent);
    }

    @PreAuthorize("hasRole('MANAGER')")
    public UserEventResponse reviewUserEventRegistrationRequest(String userId, String participantId, Long eventId, UserEventRequest request) {
        UserEvent userEvent = findEntityByUserIdAndEventId(participantId, eventId);
        EventSnapshot eventSnapshot = eventSnapshotService.findEntityById(eventId);
        if (!eventSnapshot.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to review user's request to event with id " + eventId);
        }
        boolean validTransition = (userEvent.getStatus() == UserEventStatus.PENDING
                        && (request.getStatus() == UserEventStatus.APPROVED || request.getStatus() == UserEventStatus.REJECTED))
                        || (userEvent.getStatus() == UserEventStatus.APPROVED && request.getStatus() == UserEventStatus.COMPLETED);
        if (!validTransition) {
            throw new IllegalArgumentException("Invalid status transition");
        }
        switch (request.getStatus()) {
            case APPROVED -> approveUserEvent(userEvent, eventSnapshot);
            case REJECTED -> rejectUserEvent(userEvent, request.getNote());
            case COMPLETED -> completeUserEvent(userEvent, request.getNote());
            default -> throw new IllegalArgumentException("Unsupported status: " + request.getStatus());
        }
        UserEvent updatedUserEvent = userEventRepository.save(userEvent);
        switch (request.getStatus()) {
            case APPROVED -> registrationPublisher.publishEvent(userEventMapper.toApprovedMessage(updatedUserEvent));
            case REJECTED -> registrationPublisher.publishEvent(userEventMapper.toRejectedMessage(updatedUserEvent));
            case COMPLETED -> registrationPublisher.publishEvent(userEventMapper.toCompletedMessage(updatedUserEvent));
        }
        return userEventMapper.toResponseDto(updatedUserEvent);
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

    public UserEventResponse deleteUserEventRegistrationRequest(String userId, Long eventId) {
        UserEvent userEvent = findEntityByUserIdAndEventId(userId, eventId);
        userEventRepository.delete(userEvent);
        return userEventMapper.toResponseDto(userEvent);
    }

    public List<RegistrationResponse> getRegistrationsByEventIdsInternal(
            String ownerId,
            Long eventId,
            UserEventStatus status,
            Integer pageNum,
            Integer pageSize
    ) {
        Pageable pageable = PageRequest.of(pageNum, pageSize, Sort.by("createdAt").descending());

        Page<UserEvent> pageResult = userEventRepository.findAllByOwnerId(ownerId, eventId, status, pageable);

        return pageResult.getContent().stream()
                .map(userEventMapper::toAggregatorDto)
                .toList();
    }

}
