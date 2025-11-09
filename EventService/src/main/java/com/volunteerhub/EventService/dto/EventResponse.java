package com.volunteerhub.EventService.dto;

import com.volunteerhub.EventService.model.Address;
import com.volunteerhub.EventService.model.Category;
import com.volunteerhub.EventService.model.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {

    private Long id;

    private String name;

    private String description;

    private String imageUrl;

    private CategoryResponse category;

    private AddressResponse address;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private int capacity;

    private String ownerId;

    private Status status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String approvedBy;

    private String optional;
}
