package com.volunteerhub.userservice.mapper;

import com.volunteerhub.userservice.dto.response.UserResponse;
import com.volunteerhub.userservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    public final AddressMapper addressMapper;

    private final AddressMapper addressMapper;

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .authProvider(user.getAuthProvider())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .totalEvents(user.getTotalEvents())
                .status(user.getStatus())
                .skills(user.getSkills())
                .dateOfBirth(user.getDateOfBirth())
                .phoneNumber(user.getPhoneNumber())
                .address(addressMapper.toResponse(user.getAddress()))
                .isDarkMode(user.isDarkMode())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
