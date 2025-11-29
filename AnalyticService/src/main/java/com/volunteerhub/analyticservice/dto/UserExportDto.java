package com.volunteerhub.analyticservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserExportDto(
        String id,
        String name,
        String email,
        String role,
        String status,
        String provider,

        Integer totalEvents,
        Integer badgeCount,
        String joinedDate
) {}