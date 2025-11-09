package com.volunteerhub.communityservice.service;

import com.volunteerhub.communityservice.dto.*;
import com.volunteerhub.communityservice.mapper.ReactionMapper;
import com.volunteerhub.communityservice.model.Post;
import com.volunteerhub.communityservice.model.Reaction;
import com.volunteerhub.communityservice.publisher.ReactionCreatedPublisher;
import com.volunteerhub.communityservice.repository.ReactionRepository;
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
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final PostService postService;
    private final ReactionMapper reactionMapper;
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;
    private final ReactionCreatedPublisher reactionCreatedPublisher;

    public Reaction findEntityById(Long id) {
        return reactionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Reaction with id " + id + " does not exist"));
    }

    @PreAuthorize("hasRole('ADMIN') or @postService.canAccessPost(authentication.name, #postId)")
    public List<ReactionResponse> findByPostId(Long postId, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSize = PaginationValidation.validate(pageNum, pageSize);
        return reactionRepository.findByPostId(postId, PageRequest.of(pageNumAndSize.getPageNum(), pageNumAndSize.getPageSize()))
                .getContent()
                .stream()
                .map(reactionMapper::toDto)
                .toList();
    }

    @PreAuthorize("@postService.canAccessPost(authentication.name, #postId)")
    public ReactionResponse create(String userId, Long postId, ReactionRequest reactionRequest) {
        Post post = postService.findEntityById(postId);
        Reaction reaction = Reaction.builder()
                .ownerId(userId)
                .post(post)
                .type(reactionRequest.getType())
                .build();
        Reaction createdReaction = reactionRepository.save(reaction);
        createdReaction.setPostId(postId);
        // Store count in cache
        String reactionCountKey = "reaction_count:" + postId;
        if (Boolean.TRUE.equals(stringIntegerRedisTemplate.hasKey(reactionCountKey))) {
            stringIntegerRedisTemplate.opsForValue().increment(reactionCountKey);
        }

        // Publish event
        ReactionMessage reactionMessage = ReactionMessage.builder()
                .ownerId(userId)
                .postId(postId)
                .type(reactionRequest.getType())
                .userId(post.getOwnerId())
                .build();
        reactionCreatedPublisher.publish(reactionMessage);
        return reactionMapper.toDto(createdReaction);
    }

    public ReactionResponse update(String userId, Long reactionId, ReactionRequest reactionRequest) {
        Reaction reaction = findEntityById(reactionId);
        if (!reaction.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (reactionRequest.getType() != null) {
            reaction.setType(reactionRequest.getType());
        }
        return reactionMapper.toDto(reactionRepository.save(reaction));
    }

    public ReactionResponse delete(String userId, Long reactionId) {
        Reaction reaction = findEntityById(reactionId);
        if (!reaction.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to delete this record.");
        }
        reactionRepository.delete(reaction);
        // Store count in cache
        String reactionCountKey = "reaction_count:" + reaction.getPostId();
        if (Boolean.TRUE.equals(stringIntegerRedisTemplate.hasKey(reactionCountKey))) {
            stringIntegerRedisTemplate.opsForValue().decrement(reactionCountKey);
        }
        return reactionMapper.toDto(reaction);
    }
}
