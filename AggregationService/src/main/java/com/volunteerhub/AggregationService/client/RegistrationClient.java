package com.volunteerhub.AggregationService.client;

import com.volunteerhub.AggregationService.config.FeignConfig;
import com.volunteerhub.common.dto.EventRegistrationCount;
import com.volunteerhub.common.dto.UserEventResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import com.volunteerhub.common.dto.RegistrationResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "REGISTRATIONSERVICE", configuration = FeignConfig.class)
public interface RegistrationClient {

    @GetMapping("/api/v1/registrations/events/registration-count")
    List<EventRegistrationCount> getEventsParticipantCounts(@RequestParam(required = false) List<Long> eventIds,
                                                            @RequestParam(required = false) Integer pageNum,
                                                            @RequestParam(required = false) Integer pageSize,
                                                            @RequestParam(required = false) Integer days);

    @GetMapping("/api/v1/registrations/events/{eventId}/user-ids")
    List<String> findUserIdsByEventId(@PathVariable Long eventId,
                                      @RequestParam(required = false) Integer pageNum,
                                      @RequestParam(required = false) Integer pageSize);

    @GetMapping("/api/v1/registrations/events/{eventId}")
    List<UserEventResponse> findAllByEventId(@PathVariable Long eventId,
                                             @RequestParam(required = false) UserEventStatus status,
                                             @RequestParam(required = false) Integer pageNum,
                                             @RequestParam(required = false) Integer pageSize);

    @GetMapping("/api/v1/registrations/internal/manager")
    List<RegistrationResponse> getRegistrationsByOwnerId(@RequestParam(value = "eventId", required = false) Long eventId,
                                                         @RequestParam(value = "status", required = false) UserEventStatus status,
                                                         @RequestParam("pageNum") Integer pageNum,
                                                         @RequestParam("pageSize") Integer pageSize
    );
}
