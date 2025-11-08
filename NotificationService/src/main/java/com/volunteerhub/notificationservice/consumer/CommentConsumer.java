package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.notificationservice.config.RabbitMQConfig;
import com.volunteerhub.notificationservice.dto.CommentMessage;
import com.volunteerhub.notificationservice.dto.NotificationRequest;
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
public class CommentConsumer {

    private final NotificationService notificationEventService;

    @RabbitListener(queues = RabbitMQConfig.COMMENT_CREATED_QUEUE)
    public void handleCommentCreated(CommentMessage commentMessage) {
        Map<String, Object> map = new HashMap<>();
        map.put("content", commentMessage.getContent());
        NotificationRequest notificationRequest = NotificationRequest
                .builder()
                .type(NotificationType.COMMENT)
                .actorId(commentMessage.getOwnerId())
                .contextId(commentMessage.getPostId())
                .payload(map)
                .userIds(List.of(commentMessage.getUserId()))
                .build();
        notificationEventService.create(notificationRequest);
    }
}
