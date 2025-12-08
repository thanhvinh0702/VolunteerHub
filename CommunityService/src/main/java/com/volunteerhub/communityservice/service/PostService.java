package com.volunteerhub.communityservice.service;

import com.volunteerhub.communityservice.dto.PageNumAndSizeResponse;
import com.volunteerhub.communityservice.dto.PostRequest;
import com.volunteerhub.communityservice.dto.PostResponse;
import com.volunteerhub.communityservice.mapper.PostMapper;
import com.volunteerhub.communityservice.model.Post;
import com.volunteerhub.communityservice.publisher.PostPublisher;
import com.volunteerhub.communityservice.repository.CommentRepository;
import com.volunteerhub.communityservice.repository.PostRepository;
import com.volunteerhub.communityservice.repository.ReactionRepository;
import com.volunteerhub.communityservice.utils.PaginationValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final EventRegistrationService eventRegistrationService;
    private final FileStorageService fileStorageService;
    private final PostMapper postMapper;
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;
    private final PostPublisher postPublisher;

    public Integer getCachedCommentCount(Long postId) {
        Integer cachedCommentCount = stringIntegerRedisTemplate.opsForValue().get("comment_count:" + postId);
        if (cachedCommentCount == null) {
            cachedCommentCount = commentRepository.countByPostId(postId);
            stringIntegerRedisTemplate.opsForValue().set("comment_count:" + postId, cachedCommentCount, Duration.ofHours(1));
        }
        return cachedCommentCount;
    }

    public Integer getCachedReactionCount(Long postId) {
        Integer cachedReactionCount = stringIntegerRedisTemplate.opsForValue().get("reaction_count:" + postId);
        if (cachedReactionCount == null) {
            cachedReactionCount = reactionRepository.countByPostId(postId);
            stringIntegerRedisTemplate.opsForValue().set("reaction_count:" + postId, cachedReactionCount, Duration.ofHours(1));
        }
        return cachedReactionCount;
    }

    public Post findEntityById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post with id " + id + " does not exist"));
    }

    @PostAuthorize("hasRole('ADMIN') or @eventRegistrationService.isParticipant(returnObject.eventId)")
    public PostResponse findById(Long id) {
        return postMapper.toDto(
                postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post with id " + id + " does not exist")),
                getCachedReactionCount(id),
                getCachedCommentCount(id)
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @eventRegistrationService.isParticipant(#eventId)")
    public List<PostResponse> findByEventId(Long eventId, String sortedBy, String order, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSize = PaginationValidation.validate(pageNum, pageSize);
        Sort sort = order.equals("desc") ? Sort.by(sortedBy).descending() : Sort.by(sortedBy).ascending();
        return postRepository.findByEventId(eventId, PageRequest.of(pageNumAndSize.getPageNum(), pageNumAndSize.getPageSize(), sort))
                .getContent()
                .stream()
                .map(p -> {
                    int reactionCount = getCachedReactionCount(p.getId());
                    int commentCount = getCachedCommentCount(p.getId());
                    return postMapper.toDto(p, reactionCount, commentCount);
                })
                .toList();
    }

    @PreAuthorize("@eventRegistrationService.isParticipant(#eventId)")
    public PostResponse create(String ownerId, Long eventId, PostRequest postRequest, List<MultipartFile> imageFiles) throws IOException {
        List<String> imageUrls = fileStorageService.uploadFiles(imageFiles);
        Post post = Post.builder()
                .eventId(eventId)
                .content(postRequest.getContent())
                .imageUrls(imageUrls)
                .ownerId(ownerId)
                .build();
        Post savedPost = postRepository.save(post);
        postPublisher.publishPostCreatedEvent(postMapper.toPostCreatedMessage(savedPost));
        return postMapper.toDto(savedPost, 0, 0);
    }

    // TODO: Delete old images
    public PostResponse update(String userId, Long postId, PostRequest postRequest, List<MultipartFile> imageFiles) throws IOException {
        Post post = findEntityById(postId);
        if (!post.getOwnerId() .equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (imageFiles != null) {
            List<String> imageUrls = fileStorageService.uploadFiles(imageFiles);
            post.setImageUrls(imageUrls);
        }
        if (postRequest.getContent() != null) {
            post.setContent(postRequest.getContent());
        }
        return postMapper.toDto(postRepository.save(post), getCachedReactionCount(postId), getCachedCommentCount(postId));
    }

    // TODO: Delete old images
    public PostResponse delete(String userId, Long postId) {
        Post post = findEntityById(postId);
        if (!post.getOwnerId() .equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to delete this record.");
        }
        postRepository.delete(post);
        return postMapper.toDto(post, getCachedReactionCount(postId), getCachedCommentCount(postId));
    }

    public boolean canAccessPost(String userId, Long postId) {
        Post post = findEntityById(postId);
        return eventRegistrationService.isParticipant(post.getEventId());
    }
}
