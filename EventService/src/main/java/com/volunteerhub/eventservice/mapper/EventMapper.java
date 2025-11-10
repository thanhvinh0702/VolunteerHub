package com.volunteerhub.eventservice.mapper;

import com.volunteerhub.common.dto.message.event.EventApprovedMessage;
import com.volunteerhub.common.dto.message.event.EventRejectedMessage;
import com.volunteerhub.eventservice.dto.response.EventResponse;
import com.volunteerhub.eventservice.model.Event;
import com.volunteerhub.common.dto.message.event.EventCreatedMessage;
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

    public EventCreatedMessage toCreatedMessage(Event event) {
        return EventCreatedMessage.builder()
                .id(event.getId())
                .name(event.getName())
                .category(categoryMapper.toDto(event.getCategory()))
                .ownerId(event.getOwnerId())
                .status(event.getStatus())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .build();
    }

    public EventApprovedMessage toApprovedMessage(Event event) {
        return EventApprovedMessage.builder()
                .eventId(event.getId())
                .eventName(event.getName())
                .category(categoryMapper.toDto(event.getCategory()))
                .capacity(event.getCapacity())
                .ownerId(event.getOwnerId())
                .approvedBy(event.getApprovedBy())
                .status(event.getStatus())
                .build();
    }

    public EventRejectedMessage toRejectedMessage(Event event, String reason) {
        return EventRejectedMessage.builder()
                .eventId(event.getId())
                .eventName(event.getName())
                .category(categoryMapper.toDto(event.getCategory()))
                .ownerId(event.getOwnerId())
                .approvedBy(event.getApprovedBy())
                .status(event.getStatus())
                .reason(reason)
                .build();
    }
}
