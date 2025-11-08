package com.volunteerhub.EventService.mapper;

import com.volunteerhub.EventService.dto.EventResponse;
import com.volunteerhub.EventService.model.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toDto(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .imageUrl(event.getImageUrl())
                .categoryId(event.getCategoryId())
                .addressId(event.getAddressId())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .capacity(event.getCapacity())
                .status(event.getStatus())
                .ownerId(event.getOwnerId())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .approvedBy(event.getApprovedBy())
                .build();
    }
}
