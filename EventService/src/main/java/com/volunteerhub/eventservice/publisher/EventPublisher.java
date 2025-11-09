package com.volunteerhub.eventservice.publisher;

import com.volunteerhub.common.dto.message.EventMessage;
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

    public void publishEvent(EventMessage eventMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                eventRoutingKey,
                eventMessage
        );
    }
}
