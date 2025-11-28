package com.volunteerhub.userservice.service;

import com.volunteerhub.common.dto.message.user.UserUpdatedMessage;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.common.enums.UserStatus;
import com.volunteerhub.userservice.dto.UserRequest;
import com.volunteerhub.userservice.model.Address;
import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.Status;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.publisher.UserPublisher;
import com.volunteerhub.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final UserPublisher userPublisher;
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;
    private final String keyUser = "analytic:total_users";
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
                .authProvider(userRequest.getAuthProvider())
                .role(userRole)
                .bio(userRequest.getBio())
                .avatarUrl(userRequest.getAvatarUrl())
                .skills(userRequest.getSkills())
                .dateOfBirth(userRequest.getDateOfBirth())
                .phoneNumber(userRequest.getPhoneNumber())
                .address(address)
                .addressId(addressId)
                .username(userRequest.getUsername())
                .isDarkMode(userRequest.isDarkMode() ? true : false)
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
        if (userRequest.getSkills() != null) {
            existedUser.setSkills(userRequest.getSkills());
        }
        if (userRequest.getDateOfBirth() != null) {
            existedUser.setDateOfBirth(userRequest.getDateOfBirth());
        }
        if (userRequest.getPhoneNumber() != null) {
            existedUser.setPhoneNumber(userRequest.getPhoneNumber());
        }
        if (userRequest.getAddress() != null && userRequest.getAddress().getDistrict() != null &&
                userRequest.getAddress().getProvince() != null && userRequest.getAddress().getStreet() != null) {
            Address address = addressService.findOrCreateAddress(userRequest.getAddress());
            existedUser.setAddress(address);
            existedUser.setAddressId(address.getId());
        }

        if (userRequest.isDarkMode()) {
            existedUser.setDarkMode(true);
        } else {
            existedUser.setDarkMode(false);
        }
        return userRepository.save(existedUser);
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
        userPublisher.publishEvent(new UserUpdatedMessage(
                UUID.fromString(user.getId()), user.getEmail(), userRole, LocalDateTime.now(), userStatus, adminID
        ));
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
}
