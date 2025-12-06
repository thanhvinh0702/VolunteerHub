package com.volunteerhub.AggregationService.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrendingEventResponse {

    @JsonUnwrapped
    private AggregatedEventResponse eventResponse;
    private Long registrationGrowth;
    private Long participantGrowth;
}
