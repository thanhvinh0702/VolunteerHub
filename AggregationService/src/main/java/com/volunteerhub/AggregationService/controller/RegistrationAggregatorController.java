package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedUserEventResponse;
import com.volunteerhub.AggregationService.service.RegistrationAggregatorService;
import com.volunteerhub.common.enums.UserEventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/aggregated/registrations")
public class RegistrationAggregatorController {

    private final RegistrationAggregatorService registrationAggregatorService;

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<AggregatedUserEventResponse>> getAllEventRegistration(@PathVariable Long eventId,
                                                                                     @RequestParam(required = false) UserEventStatus status,
                                                                                     @RequestParam(required = false) Integer pageNum,
                                                                                     @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(registrationAggregatorService.getEventRegistration(eventId, status, pageNum, pageSize));
    }
}
