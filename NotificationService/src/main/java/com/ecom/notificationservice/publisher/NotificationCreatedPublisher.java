package com.ecom.notificationservice.publisher;

import com.ecom.notificationservice.config.RabbitMQConfig;
import com.ecom.notificationservice.dto.NotificationEventRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationCreatedPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishEvent(NotificationEventRequest notificationEventRequest) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                notificationEventRequest
        );
    }
}
