package com.volunteerhub.communityservice.repository;

import com.volunteerhub.communityservice.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostId(Long postId);

    int countByPostId(Long postId);

    List<Comment> findByParentId(Long parentId);
}
