package com.volunteerhub.registrationservice.controller;

import com.volunteerhub.common.dto.EventRegistrationCount;
import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.registrationservice.dto.UserEventRequest;
import com.volunteerhub.registrationservice.dto.UserEventResponse;
import com.volunteerhub.registrationservice.service.UserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/registrations")
@RequiredArgsConstructor
public class UserEventController {

    private final UserEventService userEventService;

    @GetMapping
    public ResponseEntity<List<UserEventResponse>> findAllByUserId(@RequestParam(required = false) UserEventStatus status,
                                                                   @RequestParam(required = false) Integer pageNum,
                                                                   @RequestParam(required = false) Integer pageSize) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userEventService.findByUserId(authentication.getName(), status, pageNum, pageSize));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<UserEventResponse>> findAllByEventId(@PathVariable Long eventId,
                                                                    @RequestParam(required = false) UserEventStatus status,
                                                                    @RequestParam(required = false) Integer pageNum,
                                                                    @RequestParam(required = false) Integer pageSize) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userEventService.findByEventId(authentication.getName(), eventId, status, pageNum, pageSize));
    }

    @GetMapping("/events/{eventId}/isParticipant")
    public Boolean checkIsParticipant(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userEventService.isParticipant(authentication.getName(), eventId);
    }

    @GetMapping("/events/registration-count")
    public ResponseEntity<List<EventRegistrationCount>> getEventsParticipantCounts(@RequestParam(required = false) List<Long> eventIds,
                                                                                   @RequestParam(required = false) Integer pageNum,
                                                                                   @RequestParam(required = false) Integer pageSize,
                                                                                   @RequestParam(required = false) Integer days) {
        if (eventIds != null && !eventIds.isEmpty()) {
            return ResponseEntity.ok(userEventService.getEventsParticipantCount(eventIds));
        }
        LocalDateTime to = days == null ? null : LocalDateTime.now();
        LocalDateTime from = days == null ? null : to.minusDays(days);
        return ResponseEntity.ok(userEventService.getAllEventsParticipantCount(pageNum, pageSize, from, to));
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<UserEventResponse> userEventRegister(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>(userEventService.registerUserEvent(authentication.getName(), eventId), HttpStatus.CREATED);
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<UserEventResponse> deleteUserEventRegister(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userEventService.deleteUserEventRegistrationRequest(authentication.getName(), eventId));
    }

    @PutMapping("/events/{eventId}/participants/{participantId}")
    public ResponseEntity<UserEventResponse> reviewUserEventRegistration(@PathVariable Long eventId,
                                                                                @PathVariable String participantId,
                                                                                @RequestBody UserEventRequest userEventRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userEventService.reviewUserEventRegistrationRequest(
                authentication.getName(),
                participantId,
                eventId,
                userEventRequest)
        );
    }
}
