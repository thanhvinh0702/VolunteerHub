package com.volunteerhub.common.dto.message.reaction;

import com.volunteerhub.common.enums.ReactionType;
import lombok.*;

@Data
@Builder
public class ReactionCreatedMessage {

    private String ownerId;
    private Long postId;
    private ReactionType type;
    // User to notify
    private String userId;
}
