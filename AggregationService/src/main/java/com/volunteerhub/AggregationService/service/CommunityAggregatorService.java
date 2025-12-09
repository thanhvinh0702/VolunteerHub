package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.CommunityClient;
import com.volunteerhub.AggregationService.client.UserClient;
import com.volunteerhub.AggregationService.dto.AggregatedCommentResponse;
import com.volunteerhub.AggregationService.dto.AggregatedPostResponse;
import com.volunteerhub.AggregationService.dto.AggregatedReactionResponse;
import com.volunteerhub.common.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityAggregatorService {

    private final CommunityClient communityClient;
    private final UserClient userClient;

    public PageResponse<AggregatedPostResponse> getAllAggregatedPost(Long eventId, String sortedBy, String order, Integer pageNum, Integer pageSize) {
        PageResponse<PostResponse> posts = communityClient.findAllPosts(eventId, sortedBy, order, pageNum, pageSize);
        List<String> userIds = posts.getContent().stream().map(PostResponse::getOwnerId).toList();
        List<UserResponse> users = userClient.findAllByIds(userIds);
        Map<String, UserResponse> usersMap = users.stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        List<AggregatedPostResponse> dtoList = posts.getContent().stream()
                .map(p -> {
                    UserResponse userResponse = usersMap.getOrDefault(p.getOwnerId(), UserResponse.builder().build());
                    return AggregatedPostResponse.builder()
                            .post(p)
                            .owner(userResponse)
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedPostResponse>builder()
                .content(dtoList)
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .number(posts.getNumber())
                .size(posts.getSize())
                .build();
    }

    public AggregatedPostResponse getAggregatedPostById(Long postId) {
        PostResponse postResponse = communityClient.findPostById(postId);
        UserResponse userResponse = userClient.findById(postResponse.getOwnerId());
        return AggregatedPostResponse.builder()
                .post(postResponse)
                .owner(userResponse)
                .build();
    }

    public PageResponse<AggregatedCommentResponse> getAllAggregatedComment(Long postId, Integer pageNum, Integer pageSize) {
        PageResponse<CommentResponse> posts = communityClient.findAllComments(postId, pageNum, pageSize);
        List<String> userIds = posts.getContent().stream().map(CommentResponse::getOwnerId).toList();
        List<UserResponse> users = userClient.findAllByIds(userIds);
        Map<String, UserResponse> usersMap = users.stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        List<AggregatedCommentResponse> dtoList = posts.getContent().stream()
                .map(p -> {
                    UserResponse userResponse = usersMap.getOrDefault(p.getOwnerId(), UserResponse.builder().build());
                    return AggregatedCommentResponse.builder()
                            .comment(p)
                            .owner(userResponse)
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedCommentResponse>builder()
                .content(dtoList)
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .number(posts.getNumber())
                .size(posts.getSize())
                .build();
    }

    public PageResponse<AggregatedReactionResponse> getAllAggregatedReaction(Long postId, Integer pageNum, Integer pageSize) {
        PageResponse<ReactionResponse> posts = communityClient.findAllReactions(postId, pageNum, pageSize);
        List<String> userIds = posts.getContent().stream().map(ReactionResponse::getOwnerId).toList();
        List<UserResponse> users = userClient.findAllByIds(userIds);
        Map<String, UserResponse> usersMap = users.stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        List<AggregatedReactionResponse> dtoList = posts.getContent().stream()
                .map(p -> {
                    UserResponse userResponse = usersMap.getOrDefault(p.getOwnerId(), UserResponse.builder().build());
                    return AggregatedReactionResponse.builder()
                            .reaction(p)
                            .owner(userResponse)
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedReactionResponse>builder()
                .content(dtoList)
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .number(posts.getNumber())
                .size(posts.getSize())
                .build();
    }
}
