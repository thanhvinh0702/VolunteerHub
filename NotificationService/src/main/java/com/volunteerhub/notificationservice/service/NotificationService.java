package com.volunteerhub.notificationservice.service;

import com.volunteerhub.common.dto.message.EventApprovedMessage;
import com.volunteerhub.common.dto.message.EventCreatedMessage;
import com.volunteerhub.common.dto.message.EventRejectedMessage;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.notificationservice.client.UserServiceClient;
import com.volunteerhub.notificationservice.dto.request.NotificationRequest;
import com.volunteerhub.notificationservice.dto.response.NotificationResponse;
import com.volunteerhub.notificationservice.mapper.NotificationMapper;
import com.volunteerhub.notificationservice.model.Notification;
import com.volunteerhub.notificationservice.model.NotificationType;
import com.volunteerhub.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserServiceClient userServiceClient;
    private final NotificationMapper notificationMapper;

    public Notification findEntityById(Long id) {
        return notificationRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Notification with id " + id + " does not exist"));
    }

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

    public List<NotificationResponse> getAllNotification(String userId, Integer pageNum, Integer pageSize) {
        int page = (pageNum == null) ? 0 : pageNum;
        int size = (pageSize == null) ? 10 : pageSize;
        if (page < 0) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 0");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        return notificationRepository.findByUserIdOrderByIdDesc(userId, PageRequest.of(page, size)).getContent()
                .stream()
                .map(notificationMapper::toResponseDTO)
                .toList();
    }

    public NotificationResponse markAsRead(String userId, Long notificationId) {
        Notification notification = findEntityById(notificationId);
        if (!notification.getUserId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (!Boolean.TRUE.equals(notification.getIsRead())) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
        return notificationMapper.toResponseDTO(notification);
    }

    public NotificationResponse delete(String userId, Long notificationId) {
        Notification notification = findEntityById(notificationId);
        if (!userId.equals(notification.getUserId())) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        notificationRepository.delete(notification);
        return notificationMapper.toResponseDTO(notification);
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

    /**
     * This method should handle the creation of notifications when an event is rejected.
     * @param eventRejectedMessage: the message publish by event service when an event rejected.
     */
    public void handleEventRejectedNotification(EventRejectedMessage eventRejectedMessage) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("category", eventRejectedMessage.getCategory().getName());
        payload.put("name", eventRejectedMessage.getEventName());
        payload.put("approved_time", eventRejectedMessage.getApprovedTime());
        payload.put("reason", eventRejectedMessage.getReason());
        Notification notification = Notification.builder()
                .type(NotificationType.EVENT_REJECTED)
                .actorId(eventRejectedMessage.getApprovedBy())
                .contextId(eventRejectedMessage.getEventId())
                .userId(eventRejectedMessage.getOwnerId())
                .payload(payload)
                .build();
        notificationRepository.save(notification);
    }
}
