package com.volunteerhub.AggregationService.client;

import com.volunteerhub.AggregationService.config.FeignConfig;
import com.volunteerhub.common.dto.EventRegistrationCount;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "REGISTRATIONSERVICE", configuration = FeignConfig.class)
public interface RegistrationClient {

    @GetMapping("/api/v1/registrations/events/current-participant")
    List<EventRegistrationCount> getEventsParticipantCounts(@RequestParam List<Long> eventIds);
}
