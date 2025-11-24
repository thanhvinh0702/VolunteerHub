package com.volunteerhub.analyticservice.controller;

import com.volunteerhub.analyticservice.service.AnalyticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticController {

    private final AnalyticService analyticService;

    @GetMapping("/total-events")
    public Integer getTotalEvents() {
        return analyticService.getTotalEvents();
    }

    @GetMapping("/total-users")
    public Integer getTotalUsers() {
        return analyticService.getTotalUsers();
    }

    @GetMapping("/{ownerId}/total-users/application_rate")
    public Integer updateApplicationRateCache(@PathVariable String ownerId) {
        return analyticService.updateApplicationRateCache(ownerId);
    }

    @GetMapping("/{ownerId}/total-users/approve_rate")
    public Integer updateApprovalRateCache(@PathVariable String ownerId) {
        return analyticService.updateApprovalRateCache(ownerId);
    }

}
