package com.volunteerhub.communityservice.service;

import com.volunteerhub.communityservice.dto.PageNumAndSizeResponse;
import com.volunteerhub.communityservice.dto.PostRequest;
import com.volunteerhub.communityservice.dto.PostResponse;
import com.volunteerhub.communityservice.mapper.PostMapper;
import com.volunteerhub.communityservice.model.Post;
import com.volunteerhub.communityservice.repository.PostRepository;
import com.volunteerhub.communityservice.utils.PaginationValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final EventRegistrationService eventRegistrationService;
    private final PostMapper postMapper;

    public Post findEntityById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post with id " + id + " does not exist"));
    }

    @PostAuthorize("hasRole('ADMIN') or @eventRegistrationService.isParticipant(authentication.name, returnObject.eventId)")
    public PostResponse findById(Long id) {
        return postMapper.toDto(
                postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post with id " + id + " does not exist")),
                0,
                0
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @eventRegistrationService.isParticipant(authentication.name, #eventId)")
    public List<PostResponse> findByEventId(Long eventId, Integer pageNum, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSize = PaginationValidation.validate(pageNum, pageSize);
        return postRepository.findByEventId(eventId, PageRequest.of(pageNumAndSize.getPageNum(), pageNumAndSize.getPageSize()))
                .getContent()
                .stream()
                .map(p -> postMapper.toDto(p, 0, 0))
                .toList();
    }

    // TODO: publish event a post have been created
    @PreAuthorize("@eventRegistrationService.isParticipant(authentication.name, #eventId)")
    public PostResponse create(String ownerId, Long eventId, PostRequest postRequest) {
        Post post = Post.builder()
                .eventId(eventId)
                .content(postRequest.getContent())
                .imageUrls(postRequest.getImageUrls())
                .ownerId(ownerId)
                .build();
        return postMapper.toDto(postRepository.save(post), 0, 0);
    }

    public PostResponse update(String userId, Long postId, PostRequest postRequest) {
        Post post = findEntityById(postId);
        if (!post.getOwnerId() .equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to modify this record.");
        }
        if (postRequest.getContent() != null) {
            post.setContent(postRequest.getContent());
        }
        if (postRequest.getImageUrls() != null) {
            post.setImageUrls(postRequest.getImageUrls());
        }
        return postMapper.toDto(postRepository.save(post), 0, 0);
    }

    public PostResponse delete(String userId, Long postId) {
        Post post = findEntityById(postId);
        if (!post.getOwnerId() .equals(userId)) {
            throw new AccessDeniedException("Insufficient permission to delete this record.");
        }
        postRepository.delete(post);
        return postMapper.toDto(post, 0, 0);
    }

    public boolean canAccessPost(String userId, Long postId) {
        Post post = findEntityById(postId);
        return eventRegistrationService.isParticipant(userId, post.getEventId());
    }
}
