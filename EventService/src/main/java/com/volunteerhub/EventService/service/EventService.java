package com.volunteerhub.EventService.service;

import com.volunteerhub.EventService.dto.EventRequest;
import com.volunteerhub.EventService.dto.EventResponse;
import com.volunteerhub.EventService.mapper.EventMapper;
import com.volunteerhub.EventService.model.Event;
import com.volunteerhub.EventService.model.Status;
import com.volunteerhub.EventService.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryService categoryService;
    private final AddressService addressService;
    private final EventMapper eventMapper;

    public Event findEntityById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No such event with id " + id));
    }

    public EventResponse findById(Long id) {
        return eventMapper.toDto(eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No such event with id " + id)));
    }

    public List<EventResponse> findAll(Integer pageNum, Integer pageSize, Status status) {
        int page = (pageNum == null) ? 0 : pageNum;
        int size = (pageSize == null) ? 10 : pageSize;
        if (page < 0) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 0");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        List<Event> events = eventRepository.findAll(PageRequest.of(page, size)).getContent();
        if (status != null) {
            return events.stream().filter(e -> e.getStatus() == status).map(eventMapper::toDto).toList();
        }
        return events.stream().map(eventMapper::toDto).toList();
    }

    // TODO: publish event an event has been requested
    @PreAuthorize("hasRole('MANAGER')")
    public EventResponse createEvent(String userId, EventRequest eventRequest) {
        Event event = Event.builder()
                .name(eventRequest.getName())
                .description(eventRequest.getDescription())
                .imageUrl(eventRequest.getImageUrl())
                .category(categoryService.findByID(eventRequest.getCategoryId()))
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .address(addressService.findById(eventRequest.getAddressId()))
                .capacity(eventRequest.getCapacity())
                .status(Status.PENDING)
                .ownerId(userId)
                .build();

        Event savedEvent = eventRepository.save(event);
        savedEvent.setCategoryId(eventRequest.getCategoryId());
        savedEvent.setAddressId(eventRequest.getAddressId());
        return eventMapper.toDto(savedEvent);
    }

    // TODO: publish event an event has been updated
    @PreAuthorize("hasRole('MANAGER')")
    public EventResponse updateEvent(String userId, Long eventId, EventRequest eventRequest) {
        Event event = findEntityById(eventId);
        if (!event.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (eventRequest.getName() != null) event.setName(eventRequest.getName());
        if (eventRequest.getDescription() != null) event.setDescription(eventRequest.getDescription());
        if (eventRequest.getAddressId() != null)
            event.setCategory(categoryService.findByID(eventRequest.getCategoryId()));
        if (eventRequest.getAddressId() != null)
            event.setAddress(addressService.findById(eventRequest.getAddressId()));
        if (eventRequest.getStartTime() != null) event.setStartTime(eventRequest.getStartTime());
        if (eventRequest.getEndTime() != null) event.setEndTime(eventRequest.getEndTime());
        event.setCapacity(eventRequest.getCapacity());

        Event savedEvent = eventRepository.save(event);
        savedEvent.setCategoryId(eventRequest.getCategoryId());
        savedEvent.setAddressId(eventRequest.getAddressId());
        return eventMapper.toDto(savedEvent);
    }

    // TODO: publish event an event has been deleted
    @PreAuthorize("hasRole('MANAGER')")
    public EventResponse deleteEvent(String userId, Long eventId) {
        Event event = findEntityById(eventId);
        if (!event.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to delete this record.");
        }
        eventRepository.delete(event);
        return eventMapper.toDto(event);
    }

    // TODO: publish event an event has been approved
    @PreAuthorize("hasRole('ADMIN')")
    public EventResponse approveEvent(String userId, Long eventId) {
        Event event = findEntityById(eventId);
        event.setStatus(Status.APPROVED);
        event.setApprovedBy(userId);
        return eventMapper.toDto(eventRepository.save(event));
    }
}
