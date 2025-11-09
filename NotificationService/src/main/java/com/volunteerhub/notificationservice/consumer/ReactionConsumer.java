package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.dto.request.NotificationRequest;
import com.volunteerhub.notificationservice.dto.message.reaction.ReactionMessage;
import com.volunteerhub.notificationservice.model.NotificationType;
import com.volunteerhub.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ReactionConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.REACTION_CREATED_QUEUE)
    public void handleReactionCreated(ReactionMessage reactionMessage) {
        Map<String, Object> map = new HashMap<>();
        map.put("content", reactionMessage.getType().toString());
        NotificationRequest notificationRequest = NotificationRequest
                .builder()
                .type(NotificationType.REACTION)
                .actorId(reactionMessage.getOwnerId())
                .contextId(reactionMessage.getPostId())
                .payload(map)
                .userIds(List.of(reactionMessage.getUserId()))
                .build();
        notificationService.create(notificationRequest);
    }
}
