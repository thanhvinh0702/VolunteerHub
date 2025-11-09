package com.volunteerhub.eventservice.publisher;

import com.volunteerhub.common.dto.message.EventApprovedMessage;
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

    @Value("${rabbitmq.routingKey.event}")
    private String eventRoutingKey;

    public void publishEventCreated(EventCreatedMessage eventMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                eventRoutingKey,
                eventMessage
        );
    }

    public void publishEventApproved(EventApprovedMessage eventMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                eventRoutingKey,
                eventMessage
        );
    }
}
