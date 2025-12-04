package com.volunteerhub.registrationservice.service;

import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.common.utils.PageNumAndSizeResponse;
import com.volunteerhub.common.utils.PaginationValidation;
import com.volunteerhub.registrationservice.dto.UserEventExport;
import com.volunteerhub.registrationservice.dto.UserEventRequest;
import com.volunteerhub.registrationservice.dto.UserEventResponse;
import com.volunteerhub.registrationservice.mapper.UserEventMapper;
import com.volunteerhub.registrationservice.model.EventSnapshot;
import com.volunteerhub.registrationservice.model.UserEvent;
import com.volunteerhub.registrationservice.publisher.RegistrationPublisher;
import com.volunteerhub.registrationservice.repository.EventSnapshotRepository;
import com.volunteerhub.registrationservice.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserEventService {

    private final UserEventRepository userEventRepository;
    private final EventSnapshotRepository eventSnapshotRepository;
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
        EventSnapshot tmp = eventSnapshotRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event not found"));
        userEventRepository.delete(userEvent);

        return userEventMapper.toResponseDto(userEvent);
    }

    public Long getApplicationRate(String ownerId) {
        return userEventRepository.countApplicationsByOwnerId(ownerId) /
                eventSnapshotRepository.findCapacityPerManager(ownerId);
    }

    public Long getApprovalRate(String ownerId) {
        return userEventRepository.countApprovedByOwnerId(ownerId) /
                userEventRepository.countApplicationsByOwnerId(ownerId);
    }

    public List<UserEventExport> getAllForExport() {
        return userEventRepository.findAll().stream()
                .map(userEventMapper::toExportDto)
                .collect(Collectors.toList());
    }

    public List<UserEventExport> getByEventForExport(Long eventId) {
        List<UserEventStatus> validStatuses = List.of(
                UserEventStatus.APPROVED,
                UserEventStatus.COMPLETED
        );

        List<UserEvent> events = userEventRepository.findAllByEventIdAndStatus(eventId, validStatuses);

        return events.stream()
                .map(userEventMapper::toExportDto)
                .collect(Collectors.toList());
    }

    public Long countParticipatedEvents(String userId) {
        List<UserEventStatus> activeStatuses = List.of(
                UserEventStatus.APPROVED,
                UserEventStatus.COMPLETED
        );

        return userEventRepository.countUserEventsByStatuses(userId, activeStatuses);
    }

}
