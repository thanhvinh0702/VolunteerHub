package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.common.dto.message.user.*;
import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.REGISTRATION_QUEUE)
    public void handleRegistrationEvent(UserMessage userMessage) {
        if (userMessage instanceof UserRegisteredMessage) {

        }
        else if (userMessage instanceof UserUpdatedMessage) {

        }
        else if (userMessage instanceof UserDeletedMessage) {

        }
        else if (userMessage instanceof UserDeactivatedMessage) {

        }
    }
}
