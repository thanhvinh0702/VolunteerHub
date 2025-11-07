package com.ecom.notificationservice.consumer;

import com.ecom.notificationservice.config.RabbitMQConfig;
import com.ecom.notificationservice.dto.NotificationEventRequest;
import com.ecom.notificationservice.service.query.NotificationUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationCreatedConsumer {

    private final NotificationUserService notificationUserService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_CREATED_QUEUE)
    public void handleNotificationCreated(NotificationEventRequest notificationEventRequest) {
        notificationUserService.handle(notificationEventRequest);
    }
}
