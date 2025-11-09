package com.volunteerhub.notificationservice.mapper;

import com.volunteerhub.notificationservice.dto.response.NotificationResponse;
import com.volunteerhub.notificationservice.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponseDTO(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .actorId(notification.getActorId())
                .contextId(notification.getContextId())
                .userId(notification.getUserId())
                .payload(notification.getPayload())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
