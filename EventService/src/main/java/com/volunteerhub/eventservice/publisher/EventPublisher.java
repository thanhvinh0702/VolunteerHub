package com.volunteerhub.eventservice.publisher;

import com.volunteerhub.common.dto.message.EventCreatedMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String exchange;

    @Value("${rabbitmq.routingKey.eventCreated}")
    private String eventCreatedRoutingKey;

    public void publishEventCreated(EventCreatedMessage eventMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                eventCreatedRoutingKey,
                eventMessage
        );
    }
}
