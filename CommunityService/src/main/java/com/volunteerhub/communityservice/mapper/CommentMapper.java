package com.volunteerhub.communityservice.mapper;

import com.volunteerhub.common.dto.message.CommentCreatedMessage;
import com.volunteerhub.communityservice.dto.CommentResponse;
import com.volunteerhub.communityservice.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .ownerId(comment.getOwnerId())
                .content(comment.getContent())
                .parentId(comment.getParentId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public CommentCreatedMessage toCommentCreatedMessage(Comment comment) {
        return CommentCreatedMessage.builder()
                .commentId(comment.getId())
                .postId(comment.getPostId())
                .ownerId(comment.getOwnerId())
                .content(comment.getContent())
                .userId(comment.getPost().getOwnerId())
                .build();
    }
}
