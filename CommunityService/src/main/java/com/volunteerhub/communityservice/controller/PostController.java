package com.volunteerhub.communityservice.controller;

import com.volunteerhub.communityservice.dto.PostRequest;
import com.volunteerhub.communityservice.dto.PostResponse;
import com.volunteerhub.communityservice.service.PostService;
import com.volunteerhub.communityservice.validation.OnCreate;
import com.volunteerhub.communityservice.validation.OnUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events/{eventId}/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public List<PostResponse> findAll(@PathVariable Long eventId,
                                      @RequestParam(required = false) Integer pageNum,
                                      @RequestParam(required = false) Integer pageSize) {
        return postService.findByEventId(eventId, pageNum, pageSize);
    }

    @GetMapping("/{postId}")
    public PostResponse findById(@PathVariable Long postId) {
        return postService.findById(postId);
    }

    @PostMapping
    public PostResponse create(@PathVariable Long eventId,
                               @RequestBody @Validated(OnCreate.class) PostRequest postRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.create(authentication.getName(), eventId, postRequest);
    }

    @PutMapping("/{postId}")
    public PostResponse update(@PathVariable Long postId,
                               @RequestBody @Validated(OnUpdate.class) PostRequest postRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.update(authentication.getName(), postId, postRequest);
    }

    @DeleteMapping("/{postId}")
    public PostResponse delete(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.delete(authentication.getName(), postId);
    }
}
