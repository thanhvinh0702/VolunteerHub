package com.volunteerhub.notificationservice.service;

import com.volunteerhub.notificationservice.dto.NotificationRequest;
import com.volunteerhub.notificationservice.model.Notification;
import com.volunteerhub.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void create(NotificationRequest notificationRequest) {
        List<Notification> notifications = notificationRequest.getUserIds()
                .stream()
                .map(userId -> Notification.builder()
                        .type(notificationRequest.getType())
                        .actorId(notificationRequest.getActorId())
                        .contextId(notificationRequest.getContextId())
                        .userId(userId)
                        .payload(notificationRequest.getPayload())
                        .build())
                .toList();
        notificationRepository.saveAll(notifications);
    }
}
