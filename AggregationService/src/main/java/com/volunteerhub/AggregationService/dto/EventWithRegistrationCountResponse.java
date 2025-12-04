package com.volunteerhub.AggregationService.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.volunteerhub.common.dto.EventResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventWithRegistrationCountResponse {

    @JsonUnwrapped
    private EventResponse eventResponse;
    private Long registrationCount;
}
