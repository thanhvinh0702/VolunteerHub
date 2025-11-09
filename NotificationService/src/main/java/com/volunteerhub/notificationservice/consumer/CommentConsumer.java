package com.volunteerhub.notificationservice.consumer;

import com.volunteerhub.common.dto.message.CommentCreatedMessage;
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
public class CommentConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.COMMENT_QUEUE)
    public void handleCommentEvent(CommentCreatedMessage commentMessage) {
        Map<String, Object> map = new HashMap<>();
        map.put("content", ((CommentCreatedMessage) commentMessage).getContent());
        NotificationRequest notificationRequest = NotificationRequest
                .builder()
                .type(NotificationType.COMMENT)
                .actorId(((CommentCreatedMessage) commentMessage).getOwnerId())
                .contextId(((CommentCreatedMessage) commentMessage).getPostId())
                .payload(map)
                .userIds(List.of(((CommentCreatedMessage) commentMessage).getUserId()))
                .build();
        notificationService.create(notificationRequest);
    }
}
