package com.volunteerhub.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String provider;

    private Integer totalEvents;
    private Integer badgeCount;

    private String joinedDate;
}
