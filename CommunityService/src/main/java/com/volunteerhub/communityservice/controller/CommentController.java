package com.volunteerhub.communityservice.controller;

import com.volunteerhub.communityservice.dto.CommentRequest;
import com.volunteerhub.communityservice.dto.CommentResponse;
import com.volunteerhub.communityservice.service.CommentService;
import com.volunteerhub.communityservice.validation.OnCreate;
import com.volunteerhub.communityservice.validation.OnUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events/{eventId}/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<CommentResponse> findAll(@PathVariable Long postId,
                                         @RequestParam(required = false) Integer pageNum,
                                         @RequestParam(required = false) Integer pageSize) {
        return commentService.findByPostId(postId, pageNum, pageSize);
    }

    @PostMapping
    public CommentResponse create(@PathVariable Long postId,
                                  @RequestBody @Validated(OnCreate.class) CommentRequest commentRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return commentService.create(authentication.getName(), postId, commentRequest);
    }

    @PutMapping("/{commentId}")
    public CommentResponse update(@PathVariable Long commentId,
                                  @RequestBody @Validated(OnUpdate.class) CommentRequest commentRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return commentService.update(authentication.getName(), commentId, commentRequest);
    }

    @DeleteMapping("/{commentId}")
    public CommentResponse delete(@PathVariable Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return commentService.delete(authentication.getName(), commentId);
    }

}
