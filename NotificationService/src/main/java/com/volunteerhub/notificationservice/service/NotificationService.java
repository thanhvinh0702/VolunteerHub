package com.volunteerhub.notificationservice.service;

import com.volunteerhub.common.dto.message.EventApprovedMessage;
import com.volunteerhub.common.dto.message.EventCreatedMessage;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.notificationservice.client.UserServiceClient;
import com.volunteerhub.notificationservice.dto.request.NotificationRequest;
import com.volunteerhub.notificationservice.model.Notification;
import com.volunteerhub.notificationservice.model.NotificationType;
import com.volunteerhub.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserServiceClient userServiceClient;

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

    /**
     * This method should handle the creation of notifications when an event is created.
     * @param eventCreatedMessage: the message publish by event service when an event created.
     */
    public void handleEventCreatedNotification(EventCreatedMessage eventCreatedMessage) {
        List<String> adminIds = userServiceClient.findAllUserIds(UserRole.ADMIN);
        Map<String, Object> payload = new HashMap<>();
        payload.put("category", eventCreatedMessage.getCategory().getName());
        payload.put("name", eventCreatedMessage.getName());
        payload.put("start_time", eventCreatedMessage.getStartTime());
        payload.put("end_time", eventCreatedMessage.getEndTime());
        List<Notification> notifications = adminIds
                .stream()
                .map(adminId -> Notification.builder()
                        .type(NotificationType.EVENT_REQUESTED)
                        .actorId(eventCreatedMessage.getOwnerId())
                        .contextId(eventCreatedMessage.getId())
                        .userId(adminId)
                        .payload(payload)
                        .build())
                .toList();
        notificationRepository.saveAll(notifications);
    }

    /**
     * This method should handle the creation of notifications when an event is approved.
     * @param eventApprovedMessage: the message publish by event service when an event approved.
     */
    public void handleEventApprovedNotification(EventApprovedMessage eventApprovedMessage) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("category", eventApprovedMessage.getCategory().getName());
        payload.put("name", eventApprovedMessage.getEventName());
        payload.put("approved_time", eventApprovedMessage.getApprovedTime());
        Notification notification = Notification.builder()
                .type(NotificationType.EVENT_APPROVED)
                .actorId(eventApprovedMessage.getApprovedBy())
                .contextId(eventApprovedMessage.getEventId())
                .userId(eventApprovedMessage.getOwnerId())
                .payload(payload)
                .build();
        notificationRepository.save(notification);
    }
}
