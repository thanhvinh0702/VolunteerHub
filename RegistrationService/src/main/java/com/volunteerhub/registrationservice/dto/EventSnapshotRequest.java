package com.volunteerhub.registrationservice.dto;

import com.volunteerhub.common.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventSnapshotRequest {

    private Long eventId;
    private Integer capacity;
    private EventStatus status;
    private String ownerId;
}
