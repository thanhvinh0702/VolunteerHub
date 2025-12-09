package com.volunteerhub.communityservice.service;

import com.volunteerhub.common.dto.PageResponse;
import com.volunteerhub.common.dto.ReactionResponse;
import com.volunteerhub.communityservice.dto.*;
import com.volunteerhub.communityservice.mapper.ReactionMapper;
import com.volunteerhub.communityservice.model.Post;
import com.volunteerhub.communityservice.model.Reaction;
import com.volunteerhub.communityservice.publisher.ReactionPublisher;
import com.volunteerhub.communityservice.repository.ReactionRepository;
import com.volunteerhub.communityservice.utils.PaginationValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final PostService postService;
    private final ReactionMapper reactionMapper;
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;
    private final ReactionPublisher reactionPublisher;

    public Reaction findEntityById(Long id) {
        return reactionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Reaction with id " + id + " does not exist"));
    }

    @PreAuthorize("hasRole('ADMIN') or @postService.canAccessPost(authentication.name, #postId)")
    public PageResponse<ReactionResponse> findByPostId(Long postId, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSize = PaginationValidation.validate(pageNum, pageSize);
        return reactionMapper.toDtoPage(
                reactionRepository.findByPostId(postId, PageRequest.of(pageNumAndSize.getPageNum(), pageNumAndSize.getPageSize()))
        );
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
        reactionPublisher.publicReactionCreatedEvent(reactionMapper.toReactionCreatedMessage(reaction));
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
