package com.volunteerhub.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserLoginHistoryRequest {
    @NotBlank(message = "user id cannot be blank")
    private String userId;
    @NotBlank(message = "ip address cannot be blank")
    private String ipAddress;
}
