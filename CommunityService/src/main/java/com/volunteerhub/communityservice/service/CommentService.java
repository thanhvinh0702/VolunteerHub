package com.volunteerhub.communityservice.service;

import com.volunteerhub.communityservice.dto.CommentMessage;
import com.volunteerhub.communityservice.dto.CommentRequest;
import com.volunteerhub.communityservice.dto.CommentResponse;
import com.volunteerhub.communityservice.dto.PageNumAndSizeResponse;
import com.volunteerhub.communityservice.mapper.CommentMapper;
import com.volunteerhub.communityservice.model.Comment;
import com.volunteerhub.communityservice.model.Post;
import com.volunteerhub.communityservice.publisher.CommentCreatedPublisher;
import com.volunteerhub.communityservice.repository.CommentRepository;
import com.volunteerhub.communityservice.utils.PaginationValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;
    private final CommentMapper commentMapper;
    private final CommentCreatedPublisher commentCreatedPublisher;
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;

    public Comment findEntityById(Long id) {
        return commentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Comment with id " + id + " does not exist"));
    }

    @PreAuthorize("hasRole('ADMIN') or @postService.canAccessPost(authentication.name, #postId)")
    public List<CommentResponse> findByPostId(Long postId, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSize = PaginationValidation.validate(pageNum, pageSize);
        return commentRepository.findByPostId(postId, PageRequest.of(pageNumAndSize.getPageNum(), pageNumAndSize.getPageSize())).getContent()
                .stream()
                .map(commentMapper::toDto)
                .toList();
    }

    @PreAuthorize("@postService.canAccessPost(authentication.name, #postId)")
    public CommentResponse create(String userId, Long postId, CommentRequest commentRequest) {
        Post post = postService.findEntityById(postId);
        Comment parentComment = null;
        if (commentRequest.getParentId() != null) {
            parentComment = findEntityById(commentRequest.getParentId());
        }
        Comment comment = Comment.builder()
                .post(post)
                .ownerId(userId)
                .parentComment(parentComment)
                .content(commentRequest.getContent())
                .build();
        Comment createdComment = commentRepository.save(comment);
        createdComment.setPostId(postId);
        createdComment.setParentId(commentRequest.getParentId());
        // Store count in cache
        String commentCountKey = "comment_count:" + postId;
        if (Boolean.TRUE.equals(stringIntegerRedisTemplate.hasKey(commentCountKey))) {
            stringIntegerRedisTemplate.opsForValue().increment(commentCountKey);
        }
        // Publish event
        CommentMessage commentMessage = CommentMessage.builder()
                .commentId(comment.getId())
                .postId(postId)
                .parentId(commentRequest.getParentId())
                .ownerId(userId)
                .content(commentRequest.getContent())
                .userId(post.getOwnerId())
                .build();
        commentCreatedPublisher.publish(commentMessage);
        return commentMapper.toDto(createdComment);
    }

    public CommentResponse update(String userId, Long commentId, CommentRequest commentRequest) {
        Comment comment = findEntityById(commentId);
        if (!userId.equals(comment.getOwnerId())) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (commentRequest.getContent() != null) {
            comment.setContent(commentRequest.getContent());
        }
        return commentMapper.toDto(commentRepository.save(comment));
    }

    public CommentResponse delete(String userId, Long commentId) {
        Comment comment = findEntityById(commentId);
        if (!userId.equals(comment.getOwnerId())) {
            throw new AccessDeniedException("Insufficient permission to delete this record.");
        }
        commentRepository.delete(comment);
        // Store count in cache
        String commentCountKey = "comment_count:" + comment.getPostId();
        if (Boolean.TRUE.equals(stringIntegerRedisTemplate.hasKey(commentCountKey))) {
            stringIntegerRedisTemplate.opsForValue().decrement(commentCountKey);
        }
        return commentMapper.toDto(comment);
    }
}
