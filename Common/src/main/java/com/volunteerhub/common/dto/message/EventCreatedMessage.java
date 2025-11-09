package com.volunteerhub.common.dto.message;

import com.volunteerhub.common.dto.CategoryResponse;
import com.volunteerhub.common.enums.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventCreatedMessage {

    private Long id;
    private String name;
    private CategoryResponse category;
    private String ownerId;
    private EventStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}

