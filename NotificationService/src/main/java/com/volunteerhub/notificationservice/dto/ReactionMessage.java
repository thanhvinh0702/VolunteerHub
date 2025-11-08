package com.volunteerhub.notificationservice.dto;

import com.volunteerhub.notificationservice.model.ReactionType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReactionMessage {

    private String ownerId;
    private Long postId;
    private ReactionType type;
    // User to notify
    private String userId;
}
