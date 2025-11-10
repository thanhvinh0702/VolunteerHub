package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.common.dto.message.event.EventApprovedMessage;
import com.volunteerhub.common.dto.message.event.EventCreatedMessage;
import com.volunteerhub.common.dto.message.event.EventMessage;
import com.volunteerhub.common.dto.message.event.EventRejectedMessage;
import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.EVENT_QUEUE)
    public void handleEventEvent(EventMessage eventMessage) {
        if (eventMessage instanceof EventCreatedMessage) {
            notificationService.handleEventCreatedNotification((EventCreatedMessage) eventMessage);
        }
        else if (eventMessage instanceof EventApprovedMessage) {
            notificationService.handleEventApprovedNotification((EventApprovedMessage) eventMessage);
        }
        else if (eventMessage instanceof EventRejectedMessage) {
            notificationService.handleEventRejectedNotification((EventRejectedMessage) eventMessage);
        }
    }
}
