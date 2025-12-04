package com.volunteerhub.userservice.mapper;

import com.volunteerhub.userservice.dto.response.UserResponse;
import com.volunteerhub.userservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    public final AddressMapper addressMapper;
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .address(addressMapper.toResponse(user.getAddress()))
                .bio(user.getBio())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .darkMode(user.isDarkMode())
                .fullName(user.getFullName())
                .skills(user.getSkills())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .authProvider(user.getAuthProvider())
                .dateOfBirth(user.getDateOfBirth())

        .build();
    }
}
