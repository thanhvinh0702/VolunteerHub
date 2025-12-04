package com.volunteerhub.userservice.dto.response;

import com.volunteerhub.userservice.dto.request.AddressRequest;
import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private Status status;
    private String authProvider;
    private String bio;
    private Integer totalEvents;
    private Integer badgeCount;
    private String avatarUrl;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private AddressResponse address;
    private List<String> skills;
    private boolean darkMode;
}
