package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.ManagerRegistrationResponse;
import com.volunteerhub.AggregationService.service.ManagerAggregatorService;
import com.volunteerhub.common.enums.UserEventStatus;
import jakarta.ws.rs.core.SecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.security.Principal;
@RestController
@RequestMapping("/api/v1/aggregated")
@RequiredArgsConstructor
public class ManagerAggregatorController {

    private final ManagerAggregatorService managerAggregatorService;

    @GetMapping("/manager/registrations")
    public ResponseEntity<List<ManagerRegistrationResponse>> getManagerRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) UserEventStatus status,
            @RequestParam(value = "pageNum", defaultValue = "0") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize
    ) {

        return ResponseEntity.ok(managerAggregatorService.getManagerRegistrations(
                eventId,
                status,
                pageNum,
                pageSize
        ));
    }
}