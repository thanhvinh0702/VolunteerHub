package com.volunteerhub.userservice.service;

import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.common.enums.UserStatus;
import com.volunteerhub.userservice.dto.request.UserRequest;
import com.volunteerhub.userservice.dto.response.UserResponse;
import com.volunteerhub.userservice.mapper.UserMapper;
import com.volunteerhub.userservice.model.Address;
import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.Status;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No such user with id " + id));
    }

    public UserResponse getUserResponseById(String id) {
        User user = findById(id);
        return userMapper.toResponse(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new NoSuchElementException("No such user with email " + email));
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

    public List<String> findAllIds(Role role) {
        return userRepository.findAllIdsByRole(role);
    }

    @Transactional
    public UserResponse create(String userId, Role userRole, UserRequest userRequest) {
        // 1. Xử lý Address trước
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
                .status(Status.ACTIVE)
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
        User existingUser = this.findById(userId);

        // 1. Update các trường cơ bản (Sử dụng Mapper update partial là tốt nhất)
        // Nếu dùng MapStruct: userMapper.updateUserFromDto(request, existingUser);
        // Dưới đây là cách thủ công nếu chưa có Mapper update:
        updateUserFields(existingUser, userRequest);

        // 2. Xử lý Address đặc biệt
        if (userRequest.getAddress() != null) {
            Address address = addressService.findOrCreateAddress(userRequest.getAddress());
            existingUser.setAddress(address);
            existingUser.setAddressId(address.getId());
        }

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

    @PreAuthorize("hasRole('ADMIN')")
    public User lockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("No such user with id " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new AccessDeniedException("Unable to lock an admin account");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        User admin = userRepository.findByNameAdmin(name)
                .orElseThrow(() -> new NoSuchElementException("No admin found"));
        UUID adminID = UUID.fromString(admin.getId());
        user.setStatus(Status.BANNED);
        UserStatus userStatus = switchingType(user.getStatus());
        UserRole userRole = switchingRole(user.getRole());
        return userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public User unlockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("No such user with id " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new AccessDeniedException("Cannot unlock an admin account");
        }

        user.setStatus(Status.ACTIVE);
        return userRepository.save(user);
    }

    protected UserStatus switchingType(Status status) {
        if (Objects.requireNonNull(status) == Status.ACTIVE) {
            return UserStatus.ACTIVE;
        }
        return UserStatus.BANNED;
    }

    protected UserRole switchingRole(Role role) {
        switch(role) {
            case Role.MANAGER -> { return UserRole.MANAGER; }
            case Role.USER -> { return UserRole.USER; }
            default -> { return UserRole.ADMIN; }
        }
    }

    public Long countManagers() {
        return userRepository.countUsers(Role.MANAGER);
    }

    public Long countUsers() {
        return userRepository.countUsers(Role.USER);
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
