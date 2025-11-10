package com.volunteerhub.common.dto.message.event;

import com.volunteerhub.common.dto.CategoryResponse;
import com.volunteerhub.common.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventApprovedMessage implements EventMessage{

    private Long eventId;
    private String eventName;
    private CategoryResponse category;
    private int capacity;
    private String ownerId;
    private String approvedBy;
    private EventStatus status;
    @Builder.Default
    private LocalDateTime approvedTime = LocalDateTime.now();
}
