package com.volunteerhub.communityservice.publisher;

import com.volunteerhub.communityservice.dto.CommentMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentCreatedPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String exchange;

    @Value("${rabbitmq.routingKey.commentCreated}")
    private String routingKey;

    public void publish(CommentMessage commentMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                routingKey,
                commentMessage
        );
    }
}
