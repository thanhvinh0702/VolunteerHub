package com.volunteerhub.AggregationService.dto;

import com.volunteerhub.common.dto.CommentResponse;
import com.volunteerhub.common.dto.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AggregatedCommentResponse {

    private CommentResponse comment;
    private UserResponse owner;
}
