package com.volunteerhub.EventService.mapper;

import com.volunteerhub.EventService.dto.EventResponse;
import com.volunteerhub.EventService.model.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final AddressMapper addressMapper;
    private final CategoryMapper categoryMapper;

    public EventResponse toDto(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .imageUrl(event.getImageUrl())
                .category(categoryMapper.toDto(event.getCategory()))
                .address(addressMapper.toDto(event.getAddress()))
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .capacity(event.getCapacity())
                .status(event.getStatus())
                .ownerId(event.getOwnerId())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .approvedBy(event.getApprovedBy())
                .optional(event.getOptional())
                .build();
    }
}
