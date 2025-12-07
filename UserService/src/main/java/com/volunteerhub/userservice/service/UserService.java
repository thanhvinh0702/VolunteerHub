package com.volunteerhub.userservice.service;

import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.common.utils.PageNumAndSizeResponse;
import com.volunteerhub.common.utils.PaginationValidation;
import com.volunteerhub.userservice.mapper.UserMapper;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.common.enums.UserStatus;
import com.volunteerhub.userservice.dto.request.UserRequest;
import com.volunteerhub.userservice.dto.response.UserResponse;
import com.volunteerhub.userservice.mapper.UserMapper;
import com.volunteerhub.userservice.model.Address;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public User findEntityById(String id) {
        return userRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No such user with id " + id));
    }

    public UserResponse findById(String id) {
        return userMapper.toResponse(this.findEntityById(id));
    }


    public UserResponse getUserResponseById(String id) {
        UserResponse user = findById(id);
        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new NoSuchElementException("No such user with email " + email));
}

    public List<UserResponse> findAllByIds(List<String> userIds) {
        return userRepository.findAllByIds(userIds).stream().map(userMapper::toResponse).toList();
    }


    public List<UserResponse> findAll(Integer page, Integer pageSize) {
        if (page == null || pageSize == null) {
            return userRepository.findAll().stream()
                    .map(userMapper::toResponse)
                    .collect(Collectors.toList());
        }

        Pageable pageable = PageRequest.of(page, pageSize);
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<String> findAllIds(UserRole role) {
        return userRepository.findAllIdsByRole(role);
    }

    @Transactional
    public UserResponse create(String userId, UserRole userRole, UserRequest userRequest) {
        Address address = null;
        Long addressId = null;

        if (userRequest.getAddress() != null) {
            address = addressService.findOrCreateAddress(userRequest.getAddress());
            addressId = address.getId();
        }

        User user = User.builder()
                .id(userId)
                .email(userRequest.getEmail())
                .fullName(userRequest.getFullName())
                .username(userRequest.getUsername())
                .authProvider(userRequest.getAuthProvider())
                .role(userRole)
                .status(UserStatus.ACTIVE)
                .bio(userRequest.getBio())
                .avatarUrl(userRequest.getAvatarUrl())
                .skills(userRequest.getSkills())
                .dateOfBirth(userRequest.getDateOfBirth())
                .phoneNumber(userRequest.getPhoneNumber())
                .address(address)
                .addressId(addressId)
                .isDarkMode(userRequest.isDarkMode())
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    @PreAuthorize("authentication.name == #userId")
    public UserResponse update(String userId, UserRequest userRequest) {
        UserResponse existingUser = this.findById(userId);

        updateUserFields(existingUser, userRequest);

        if (userRequest.getAddress() != null) {
            Address address = addressService.findOrCreateAddress(userRequest.getAddress());
            existingUser.setAddress(address);
            existingUser.setAddressId(address.getId());
        }

        if (userRequest.isDarkMode()) {
            existedUser.setDarkMode(true);
        } else {
            existedUser.setDarkMode(false);
        }
        return userMapper.toResponse(userRepository.save(existedUser));
        User savedUser = userRepository.save(existingUser);
        return userMapper.toResponse(savedUser);
    }

    private void updateUserFields(User user, UserRequest userRequest) {
        if (userRequest.getFullName() != null) user.setFullName(userRequest.getFullName());
        if (userRequest.getBio() != null) user.setBio(userRequest.getBio());
        if (userRequest.getAvatarUrl() != null) user.setAvatarUrl(userRequest.getAvatarUrl());
        if (userRequest.getSkills() != null) user.setSkills(userRequest.getSkills());
        if (userRequest.getDateOfBirth() != null) user.setDateOfBirth(userRequest.getDateOfBirth());
        if (userRequest.getPhoneNumber() != null) user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setDarkMode(userRequest.isDarkMode());
    }


    public Long countManagers() {
        return userRepository.countUsers(UserRole.MANAGER);
    }

    public Long countUsers() {
        return userRepository.countUsers(UserRole.USER);
    }

    public UserResponse convertToExportData(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .authProvider(user.getAuthProvider())
                .totalEvents(user.getTotalEvents())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .badgeCount(user.getBadges() == null ? 0 : user.getBadges().size())

                .build();
    }

    public List<UserResponse> getExportDataForSelectedUsers(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.findAllByIdsWithBadges(userIds);

        return users.stream()
                .map(this::convertToExportData)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllUsersForExport() {
        List<User> users = userRepository.findAllForExport();

        return users.stream()
                .map(this::convertToExportData)
                .collect(Collectors.toList());
    }

}
