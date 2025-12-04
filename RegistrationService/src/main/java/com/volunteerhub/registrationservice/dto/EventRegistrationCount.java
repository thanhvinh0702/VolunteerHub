package com.volunteerhub.registrationservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventRegistrationCount {
    private Long eventId;
    private Long count;
}
