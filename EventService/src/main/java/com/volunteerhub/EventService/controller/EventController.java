package com.volunteerhub.EventService.controller;

import com.volunteerhub.EventService.dto.EventRequest;
import com.volunteerhub.EventService.dto.EventResponse;
import com.volunteerhub.EventService.model.Event;
import com.volunteerhub.EventService.service.EventService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/events")
@AllArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest eventRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (!auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"))) {
            throw new AccessDeniedException("Only Event manager can create events");
        }

        Event event = eventService.createEvent(auth.getName(), eventRequest);
        return new ResponseEntity<>(mapToResponse(event), HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long eventId,
                                                     @RequestBody EventRequest eventRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Event event = eventService.updateEvent(eventId, eventRequest);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{eventId}/approve")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (!auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only Admin can approve events");
        }

        Event event = eventService.approveEvent(eventId, auth.getName());
        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(@RequestParam(required = false) Integer page,
                                                            @RequestParam(required = false) Integer pageSize) {
        List<Event> events = eventService.findAll(page, pageSize);
        List<EventResponse> responseList = events.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long eventId) {
        Event event = eventService.findById(eventId);
        return ResponseEntity.ok(mapToResponse(event));
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .categoryId(event.getCategory().getId())
                .addressId(event.getAddress().getId())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .capacity(event.getCapacity())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

}
