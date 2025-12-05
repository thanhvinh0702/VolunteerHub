package com.volunteerhub.AggregationService.client;

import com.volunteerhub.AggregationService.config.FeignConfig;
import com.volunteerhub.AggregationService.dto.EventWithRegistrationCountResponse;
import com.volunteerhub.common.dto.EventResponse;
import com.volunteerhub.common.enums.EventStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "EVENTSERVICE", configuration = FeignConfig.class)
public interface EventClient {

    @GetMapping("/api/v1/events")
    List<EventResponse> getAllEvents(@RequestParam(required = false) Integer pageNum,
                                     @RequestParam(required = false) Integer pageSize,
                                     @RequestParam(required = false) EventStatus status,
                                     @RequestParam(defaultValue = "id") String sortedBy,
                                     @RequestParam(defaultValue = "desc") String order);

    @GetMapping("/api/v1/events/owned")
    List<EventResponse> getAllOwnedEvents(@RequestParam(required = false) Integer pageNum,
                                          @RequestParam(required = false) Integer pageSize,
                                          @RequestParam(required = false) EventStatus status,
                                          @RequestParam(defaultValue = "id") String sortedBy,
                                          @RequestParam(defaultValue = "desc") String order);

    @GetMapping("/api/v1/events/by-ids")
    List<EventResponse> getAllEventsByIds(@RequestParam List<Long> eventIds);

    @GetMapping("/search")
    List<EventResponse> searchEvents(@RequestParam("keyword") String keyword,
                                     @RequestParam(value = "pageNum", required = false) Integer pageNum,
                                     @RequestParam(value = "pageSize", required = false) Integer pageSize);
}
