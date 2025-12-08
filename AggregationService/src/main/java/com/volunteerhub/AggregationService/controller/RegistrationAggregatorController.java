package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedUserEventResponse;
import com.volunteerhub.AggregationService.service.RegistrationAggregatorService;
import com.volunteerhub.common.dto.PageResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/aggregated/registrations")
public class RegistrationAggregatorController {

    private final RegistrationAggregatorService registrationAggregatorService;

    @GetMapping
    public ResponseEntity<PageResponse<AggregatedUserEventResponse>> getAllRegistration(@RequestParam(required = false) UserEventStatus status,
                                                                                        @RequestParam(required = false) Integer pageNum,
                                                                                        @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(registrationAggregatorService.getAllRegistrations(status, pageNum, pageSize));
    }

    @GetMapping("/events/{eventId}/participants")
    public ResponseEntity<PageResponse<AggregatedUserEventResponse>> getAllEventParticipants(@PathVariable Long eventId,
                                                                                             @RequestParam(required = false) Integer pageNum,
                                                                                             @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(registrationAggregatorService.getAllParticipantsByEventId(eventId, pageNum, pageSize));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<PageResponse<AggregatedUserEventResponse>> getAllEventRegistration(@PathVariable Long eventId,
                                                                                             @RequestParam(required = false) UserEventStatus status,
                                                                                             @RequestParam(required = false) Integer pageNum,
                                                                                             @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(registrationAggregatorService.getEventRegistration(eventId, status, pageNum, pageSize));
    }

}
