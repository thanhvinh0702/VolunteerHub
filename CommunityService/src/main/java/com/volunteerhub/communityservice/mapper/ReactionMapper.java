package com.volunteerhub.communityservice.mapper;

import com.volunteerhub.communityservice.dto.ReactionResponse;
import com.volunteerhub.communityservice.model.Reaction;
import org.springframework.stereotype.Component;

@Component
public class ReactionMapper {

    public ReactionResponse toDto(Reaction reaction) {
        return ReactionResponse.builder()
                .id(reaction.getId())
                .ownerId(reaction.getOwnerId())
                .postId(reaction.getPostId())
                .type(reaction.getType())
                .createdAt(reaction.getCreatedAt())
                .updatedAt(reaction.getUpdatedAt())
                .build();
    }
}
