package com.volunteerhub.userservice.service;

import com.volunteerhub.common.dto.UserResponse;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.common.utils.PageNumAndSizeResponse;
import com.volunteerhub.common.utils.PaginationValidation;
import com.volunteerhub.userservice.dto.UserRequest;
import com.volunteerhub.userservice.mapper.UserMapper;
import com.volunteerhub.userservice.model.Address;
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

    public List<UserResponse> findAllByIds(List<String> userIds) {
        return userRepository.findAllByIds(userIds).stream().map(userMapper::toResponse).toList();
    }

    public UserResponse findByEmail(String email) {
        return userMapper.toResponse(userRepository.findByEmail(email).orElseThrow(() ->
                new NoSuchElementException("No such user with email " + email)));
    }

    public List<UserResponse> findAll(Integer page, Integer pageSize) {
        PageNumAndSizeResponse pageNumAndSizeResponse = PaginationValidation.validate(page, pageSize);
        return userRepository.findAll(PageRequest.of(pageNumAndSizeResponse.getPageNum(),
                pageNumAndSizeResponse.getPageSize())).getContent().stream()
                .map(userMapper::toResponse).toList();
    }

    public List<String> findAllIds(UserRole role) {
        return userRepository.findAllIdsByRole(role);
    }

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
        return userMapper.toResponse(userRepository.save(user));
    }

    @PreAuthorize("authentication.name == #userId")
    public UserResponse update(String userId, UserRequest userRequest) throws AccessDeniedException {
        User existedUser = this.findEntityById(userId);
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
        return userMapper.toResponse(userRepository.save(existedUser));
    }
}
