package com.volunteerhub.userservice.service;

import com.volunteerhub.userservice.dto.UserRequest;
import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No such user with id " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new NoSuchElementException("No such user with email " + email));
    }

    public List<User> findAll(Integer page, Integer pageSize) {
        if (page == null && pageSize == null) {
            return userRepository.findAll();
        }
        if (page == null) {
            return userRepository.findAll(PageRequest.of(0, pageSize)).getContent();
        }
        if (pageSize == null) {
            return List.of();
        }
        return userRepository.findAll(PageRequest.of(page, pageSize)).getContent();
    }

    public List<String> findAllIds(Role role) {
        return userRepository.findAllIdsByRole(role);
    }

    public User create(String userId, Role userRole, UserRequest userRequest) {
        User user = User.builder()
                .id(userId)
                .email(userRequest.getEmail())
                .name(userRequest.getName())
                .authProvider(userRequest.getAuthProvider())
                .role(userRole)
                .bio(userRequest.getBio())
                .avatarUrl(userRequest.getAvatarUrl())
                .preferences(userRequest.getPreferences())
                .build();
        return userRepository.save(user);
    }

    @PreAuthorize("authentication.name == #userId")
    public User update(String userId, UserRequest userRequest) throws AccessDeniedException {
        User existedUser = this.findById(userId);
        if (userRequest.getBio() != null) {
            existedUser.setBio(userRequest.getBio());
        }
        if (userRequest.getAvatarUrl() != null) {
            existedUser.setAvatarUrl(userRequest.getAvatarUrl());
        }
        if (userRequest.getPreferences() != null) {
            existedUser.setPreferences(userRequest.getPreferences());
        }
        return userRepository.save(existedUser);
    }
}
