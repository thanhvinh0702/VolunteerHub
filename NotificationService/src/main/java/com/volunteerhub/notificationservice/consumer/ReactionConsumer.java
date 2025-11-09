package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.common.dto.message.ReactionCreatedMessage;
import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.dto.request.NotificationRequest;
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

    @RabbitListener(queues = RabbitMQConfig.REACTION_QUEUE)
    public void handleReactionEvent(ReactionCreatedMessage reactionMessage) {
        Map<String, Object> map = new HashMap<>();
        map.put("content", ((ReactionCreatedMessage) reactionMessage).getType().toString());
        NotificationRequest notificationRequest = NotificationRequest
                .builder()
                .type(NotificationType.REACTION)
                .actorId(((ReactionCreatedMessage) reactionMessage).getOwnerId())
                .contextId(((ReactionCreatedMessage) reactionMessage).getPostId())
                .payload(map)
                .userIds(List.of(((ReactionCreatedMessage) reactionMessage).getUserId()))
                .build();
        notificationService.create(notificationRequest);
    }
}
