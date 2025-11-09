package com.volunteerhub.notificationservice.dto.message.comment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentMessage {
    private Long commentId;
    private Long postId;
    private Long parentId;
    private String ownerId;
    // User to notify
    private String userId;
    private String content;
}
