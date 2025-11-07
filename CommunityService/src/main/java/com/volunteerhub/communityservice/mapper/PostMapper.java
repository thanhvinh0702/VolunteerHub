package com.volunteerhub.communityservice.mapper;

import com.volunteerhub.communityservice.dto.PostResponse;
import com.volunteerhub.communityservice.model.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostResponse toDto(Post post, int reactionCount, int commentCount) {
        return PostResponse.builder()
                .id(post.getId())
                .eventId(post.getEventId())
                .content(post.getContent())
                .ownerId(post.getOwnerId())
                .reactionCount(reactionCount)
                .commentCount(commentCount)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
