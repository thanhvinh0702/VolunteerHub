package com.volunteerhub.registrationservice.dto;

import com.volunteerhub.common.enums.UserEventStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class UserEventResponse {

    private Long id;
    private String userId;
    private Long eventId;
    private UserEventStatus status;
    private String note;
    private LocalDateTime reviewedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
