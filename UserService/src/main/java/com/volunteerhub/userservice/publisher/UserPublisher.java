package com.volunteerhub.userservice.publisher;

import com.volunteerhub.common.dto.message.user.UserMessage;
import com.volunteerhub.userservice.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEvent(UserMessage userMessage) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_USER_ROUTING_KEY,
                userMessage
        );
    }
}
