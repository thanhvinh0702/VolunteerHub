package com.volunteerhub.communityservice.publisher;

import com.volunteerhub.communityservice.dto.CommentMessage;
import com.volunteerhub.communityservice.dto.ReactionMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReactionPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String exchange;

    @Value("${rabbitmq.routingKey.reactionCreated}")
    private String routingKey;

    public void publish(ReactionMessage reactionMessage) {
        rabbitTemplate.convertAndSend(
                exchange,
                routingKey,
                reactionMessage
        );
    }
}
