package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedCommentResponse;
import com.volunteerhub.AggregationService.dto.AggregatedPostResponse;
import com.volunteerhub.AggregationService.dto.AggregatedReactionResponse;
import com.volunteerhub.AggregationService.service.CommunityAggregatorService;
import com.volunteerhub.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/aggregated/events/{eventId}")
@RequiredArgsConstructor
public class CommunityAggregatorController {

    private final CommunityAggregatorService communityAggregatorService;

    @GetMapping("/posts")
    public ResponseEntity<PageResponse<AggregatedPostResponse>> getAllAggregatedPosts(@PathVariable Long eventId,
                                                                                      @RequestParam(defaultValue = "id") String sortedBy,
                                                                                      @RequestParam(defaultValue = "desc") String order,
                                                                                      @RequestParam(required = false) Integer pageNum,
                                                                                      @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(communityAggregatorService.getAllAggregatedPost(eventId, sortedBy, order, pageNum, pageSize));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<AggregatedPostResponse> getAggregatedPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(communityAggregatorService.getAggregatedPostById(postId));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<PageResponse<AggregatedCommentResponse>> getAllAggregatedComments(@PathVariable Long postId,
                                                                                            @RequestParam(required = false) Integer pageNum,
                                                                                            @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(communityAggregatorService.getAllAggregatedComment(postId, pageNum, pageSize));
    }

    @GetMapping("/posts/{postId}/reactions")
    public ResponseEntity<PageResponse<AggregatedReactionResponse>> getAllAggregatedReactions(@PathVariable Long postId,
                                                                                              @RequestParam(required = false) Integer pageNum,
                                                                                              @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(communityAggregatorService.getAllAggregatedReaction(postId, pageNum, pageSize));
    }
}
