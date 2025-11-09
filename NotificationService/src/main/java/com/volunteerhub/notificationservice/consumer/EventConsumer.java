package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.common.dto.message.EventCreatedMessage;
import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.EVENT_CREATED_QUEUE)
    public void handleEVentCreated(EventCreatedMessage eventCreatedMessage) {
        notificationService.handleEventCreatedNotification(eventCreatedMessage);
    }
}
