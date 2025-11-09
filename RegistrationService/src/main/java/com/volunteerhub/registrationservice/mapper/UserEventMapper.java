package com.volunteerhub.registrationservice.mapper;

import com.volunteerhub.registrationservice.dto.UserEventResponse;
import com.volunteerhub.registrationservice.model.UserEvent;
import org.springframework.stereotype.Component;

@Component
public class UserEventMapper {

    public UserEventResponse toResponseDto(UserEvent userEvent) {
        return UserEventResponse.builder()
                .id(userEvent.getId())
                .userId(userEvent.getUserId())
                .eventId(userEvent.getEventId())
                .status(userEvent.getStatus())
                .note(userEvent.getNote())
                .reviewedAt(userEvent.getReviewedAt())
                .completedAt(userEvent.getCompletedAt())
                .createdAt(userEvent.getCreatedAt())
                .updatedAt(userEvent.getUpdatedAt())
                .build();
    }
}
