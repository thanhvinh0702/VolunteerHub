package com.volunteerhub.communityservice.repository;

import com.volunteerhub.communityservice.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByEventId(Long eventId, Pageable pageable);
}
