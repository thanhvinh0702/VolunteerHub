package com.volunteerhub.userservice.dto;

import com.volunteerhub.userservice.validation.OnCreate;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class UserRequest {
    @NotNull(message = "Auth provider cannot be null", groups = OnCreate.class)
    private String authProvider;

    @NotNull(message = "Name cannot be null", groups = OnCreate.class)
    private String name;

    @NotNull(message = "Email cannot be null", groups = OnCreate.class)
    private String email;

    private String bio;

    private String avatarUrl;

    private Map<String, Object> preferences;
}
