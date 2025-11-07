package com.ecom.notificationservice.service.command;

import com.ecom.notificationservice.dto.NotificationEventRequest;
import com.ecom.notificationservice.model.command.NotificationEvent;
import com.ecom.notificationservice.repository.command.NotificationEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationEventService {

    private final NotificationEventRepository notificationEventRepository;

    // TODO: publish event to query side.
    public void create(NotificationEventRequest notificationEventRequest) {
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .type(notificationEventRequest.getType())
                .actorId(notificationEventRequest.getActorId())
                .contextId(notificationEventRequest.getContextId())
                .payload(notificationEventRequest.getPayload())
                .build();
        notificationEventRepository.save(notificationEvent);
    }
}
