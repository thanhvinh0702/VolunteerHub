package com.volunteerhub.communityservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

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
