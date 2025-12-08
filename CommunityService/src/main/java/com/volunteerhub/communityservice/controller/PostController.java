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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events/{eventId}/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public List<PostResponse> findAll(@PathVariable Long eventId,
                                      @RequestParam(defaultValue = "id") String sortedBy,
                                      @RequestParam(defaultValue = "desc") String order,
                                      @RequestParam(required = false) Integer pageNum,
                                      @RequestParam(required = false) Integer pageSize) {
        return postService.findByEventId(eventId, sortedBy, order, pageNum, pageSize);
    }

    @GetMapping("/{postId}")
    public PostResponse findById(@PathVariable Long postId) {
        return postService.findById(postId);
    }

    @PostMapping
    public PostResponse create(@PathVariable Long eventId,
                               @RequestPart @Validated(OnCreate.class) PostRequest postRequest,
                               @RequestPart List<MultipartFile> imageFiles) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.create(authentication.getName(), eventId, postRequest, imageFiles);
    }

    @PutMapping("/{postId}")
    public PostResponse update(@PathVariable Long postId,
                               @RequestPart @Validated(OnUpdate.class) PostRequest postRequest,
                               @RequestPart List<MultipartFile> imageFiles) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.update(authentication.getName(), postId, postRequest, imageFiles);
    }

    @DeleteMapping("/{postId}")
    public PostResponse delete(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return postService.delete(authentication.getName(), postId);
    }
}
