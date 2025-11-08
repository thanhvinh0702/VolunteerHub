package com.volunteerhub.notificationservice.service.command;

import com.volunteerhub.notificationservice.dto.NotificationEventRequest;
import com.volunteerhub.notificationservice.model.command.NotificationEvent;
import com.volunteerhub.notificationservice.publisher.NotificationCreatedPublisher;
import com.volunteerhub.notificationservice.repository.command.NotificationEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationEventService {

    private final NotificationEventRepository notificationEventRepository;
    private final NotificationCreatedPublisher notificationCreatedPublisher;

    public void create(NotificationEventRequest notificationEventRequest) {
        System.out.println(notificationEventRequest);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .type(notificationEventRequest.getType())
                .actorId(notificationEventRequest.getActorId())
                .contextId(notificationEventRequest.getContextId())
                .payload(notificationEventRequest.getPayload())
                .build();
        notificationEventRepository.save(notificationEvent);
        notificationCreatedPublisher.publishEvent(notificationEventRequest);
    }
}
