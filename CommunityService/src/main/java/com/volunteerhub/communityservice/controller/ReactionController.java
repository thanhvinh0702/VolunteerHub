package com.volunteerhub.communityservice.controller;

import com.volunteerhub.communityservice.dto.ReactionRequest;
import com.volunteerhub.communityservice.dto.ReactionResponse;
import com.volunteerhub.communityservice.service.ReactionService;
import com.volunteerhub.communityservice.validation.OnCreate;
import com.volunteerhub.communityservice.validation.OnUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events/{eventId}/posts/{postId}/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @GetMapping
    public List<ReactionResponse> findAll(@PathVariable Long postId,
                                          @RequestParam(required = false) Integer pageNum,
                                          @RequestParam(required = false) Integer pageSize) {
        return reactionService.findByPostId(postId, pageNum, pageSize);
    }

    @PostMapping
    public ReactionResponse create(@PathVariable Long postId,
                                   @RequestBody @Validated(OnCreate.class)ReactionRequest reactionRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return reactionService.create(authentication.getName(), postId, reactionRequest);
    }

    @PutMapping("/{reactionId}")
    public ReactionResponse update(@PathVariable Long reactionId,
                                   @RequestBody @Validated(OnUpdate.class) ReactionRequest reactionRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return reactionService.update(authentication.getName(), reactionId, reactionRequest);
    }

    @DeleteMapping("/{reactionId}")
    public ReactionResponse delete(@PathVariable Long reactionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return reactionService.delete(authentication.getName(), reactionId);
    }
}
