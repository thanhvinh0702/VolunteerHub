package com.volunteerhub.EventService.service;

import com.volunteerhub.EventService.dto.EventRequest;
import com.volunteerhub.EventService.model.Event;
import com.volunteerhub.EventService.model.Status;
import com.volunteerhub.EventService.repository.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryService categoryService;
    private final AddressService addressService;

    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No such event with id " + id));
    }

    public List<Event> findAll(Integer page, Integer pageSize) {
        if (page == null && pageSize == null) {
            return eventRepository.findAll();
        }
        if (page == null) {
            return eventRepository.findAll(PageRequest.of(0, pageSize)).getContent();
        }
        if (pageSize == null) {
            return List.of();
        }
        return eventRepository.findAll(PageRequest.of(page, pageSize)).getContent();
    }

    public boolean isOwner(Long eventId, String username) {
        return eventRepository.findById(eventId)
                .map(event -> event.getOwnerId().equals(username))
                .orElse(false);
    }

  //  @PreAuthorize("hasRole('MANAGER')")
    public Event createEvent(String username, EventRequest eventRequest) {
        Event event = Event.builder()
                .name(eventRequest.getName())
                .description(eventRequest.getDescription())
                .category(categoryService.findByID(eventRequest.getCategoryID()))
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .address(addressService.findById(eventRequest.getAddressID()))
                .capacity(eventRequest.getCapacity())
                .status(Status.PENDING)
                .ownerId(UUID.fromString(username))
                .build();

        return eventRepository.save(event);
    }

    //  @PreAuthorize("hasRole('MANAGER') and @eventService.isOwner(#eventId, authentication.name)")
    public Event updateEvent(Long eventId, EventRequest eventRequest) {
        Event event = findById(eventId);

        if (eventRequest.getName() != null) event.setName(eventRequest.getName());
        if (eventRequest.getDescription() != null) event.setDescription(eventRequest.getDescription());
        if (eventRequest.getCategoryID() != null)
            event.setCategory(categoryService.findByID(eventRequest.getCategoryID()));
        if (eventRequest.getAddressID() != null)
            event.setAddress(addressService.findById(eventRequest.getAddressID()));
        if (eventRequest.getStartTime() != null) event.setStartTime(eventRequest.getStartTime());
        if (eventRequest.getEndTime() != null) event.setEndTime(eventRequest.getEndTime());
        event.setCapacity(eventRequest.getCapacity());

        return eventRepository.save(event);
    }

  //  @PreAuthorize("hasRole('MANAGER') and @eventService.isOwner(#eventId, authentication.name)")
    public void deleteEvent(Long eventId) {
        Event event = findById(eventId);
        eventRepository.delete(event);
    }

 //   @PreAuthorize("hasRole('ADMIN')")
    public Event approveEvent(Long eventId, String adminUsername) {
        Event event = findById(eventId);
        event.setStatus(Status.APPROVED);
        event.setApprovedBy(UUID.fromString(adminUsername));
        return eventRepository.save(event);
    }
}
