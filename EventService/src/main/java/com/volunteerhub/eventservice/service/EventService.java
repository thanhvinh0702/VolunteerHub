package com.volunteerhub.eventservice.service;

import com.volunteerhub.eventservice.dto.request.EventRequest;
import com.volunteerhub.eventservice.dto.response.EventResponse;
import com.volunteerhub.eventservice.mapper.EventMapper;
import com.volunteerhub.eventservice.model.Address;
import com.volunteerhub.eventservice.model.Category;
import com.volunteerhub.eventservice.model.Event;
import com.volunteerhub.eventservice.publisher.EventPublisher;
import com.volunteerhub.eventservice.repository.EventRepository;
import com.volunteerhub.common.enums.EventStatus;
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
    private final EventPublisher eventPublisher;

    public Event findEntityById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No such event with id " + id));
    }

    public EventResponse findById(Long id) {
        return eventMapper.toDto(eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No such event with id " + id)));
    }

    public List<EventResponse> findAll(Integer pageNum, Integer pageSize, EventStatus status) {
        int page = (pageNum == null) ? 0 : pageNum;
        int size = (pageSize == null) ? 10 : pageSize;
        if (page < 0) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 0");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        if (status != null) {
            return eventRepository.findByStatus(status, PageRequest.of(page, size)).getContent()
                    .stream()
                    .map(eventMapper::toDto)
                    .toList();
        }
        return eventRepository.findAll(PageRequest.of(page, size)).getContent()
                .stream()
                .map(eventMapper::toDto)
                .toList();
    }

    @PreAuthorize("hasRole('MANAGER')")
    public EventResponse createEvent(String userId, EventRequest eventRequest) {
        Category category = categoryService.findByNameOrCreate(eventRequest.getCategoryName());

        Address address = addressService.findOrCreateAddress(eventRequest.getAddress());
        Event event = Event.builder()
                .name(eventRequest.getName())
                .description(eventRequest.getDescription())
                .imageUrl(eventRequest.getImageUrl())
                .category(category)
                .status(EventStatus.PENDING)
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .address(address)
                .capacity(eventRequest.getCapacity())
                .ownerId(userId)
                .optional(eventRequest.getOptional())
                .build();

        Event savedEvent = eventRepository.save(event);
        savedEvent.setCategoryId(category.getId());
        savedEvent.setAddressId(address.getId());
        eventPublisher.publishEventCreated(eventMapper.toCreatedMessage(savedEvent));
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
        if (eventRequest.getImageUrl() != null) event.setImageUrl(eventRequest.getImageUrl());

        if (eventRequest.getCategoryName() != null && !eventRequest.getCategoryName().isBlank()) {
            Category category = categoryService.findByNameOrCreate(eventRequest.getCategoryName());
            event.setCategory(category);
            event.setCategoryId(category.getId());
        }

        if (eventRequest.getAddress() != null && eventRequest.getAddress().getCity() != null &&
                eventRequest.getAddress().getProvince() != null && eventRequest.getAddress().getStreet() != null) {
            Address address = addressService.findOrCreateAddress(eventRequest.getAddress());
            event.setAddress(address);
            event.setAddressId(address.getId());
        }

        if (eventRequest.getStartTime() != null) event.setStartTime(eventRequest.getStartTime());
        if (eventRequest.getEndTime() != null) event.setEndTime(eventRequest.getEndTime());

        if (eventRequest.getCapacity() > 0) event.setCapacity(eventRequest.getCapacity());

        if (eventRequest.getOptional() != null) event.setOptional(eventRequest.getOptional());
        Event savedEvent = eventRepository.save(event);
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

    @PreAuthorize("hasRole('ADMIN')")
    public EventResponse approveEvent(String userId, Long eventId) {
        Event event = findEntityById(eventId);
        if (event.getStatus().equals(EventStatus.APPROVED)) {
            throw new IllegalArgumentException("Event has already been approved");
        }
        event.setStatus(EventStatus.APPROVED);
        event.setApprovedBy(userId);
        eventPublisher.publishEventApproved(eventMapper.toApprovedMessage(event));
        return eventMapper.toDto(eventRepository.save(event));
    }
}
