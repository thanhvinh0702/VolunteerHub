package com.volunteerhub.analyticservice.controller;

import com.volunteerhub.analyticservice.service.AnalyticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticController {

    private final AnalyticService analyticService;

    @GetMapping("/{ownerId}/total_events_each")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> countEventsPerManager(@PathVariable String ownerId) {
        return ResponseEntity.ok(analyticService.countEventsPerManagers(ownerId));
    }

    @GetMapping("/{ownerId}/current_active_events_each")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> countActiveEventsPerManager(@PathVariable String ownerId) {
        return ResponseEntity.ok(analyticService.countActiveEventsPerManagers(ownerId));
    }

    @GetMapping("/{ownerId}/application-rate")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> getApplicationRate(@PathVariable String ownerId) {
        return ResponseEntity.ok(analyticService.getApplicationRate(ownerId));
    }

    @GetMapping("/{ownerId}/approval-rate")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> getApprovalRate(@PathVariable String ownerId) {
        return ResponseEntity.ok(analyticService.getApprovedRate(ownerId));
    }

    @GetMapping("/{ownerId}/dashboard")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Long>> getOwnerDashboard(@PathVariable String ownerId) {
        Map<String, Long> stats = new HashMap<>();

        stats.put("applicationRate", analyticService.getApplicationRate(ownerId));

        stats.put("approvalRate", analyticService.getApprovedRate(ownerId));

        // stats.put("totalApplications", analyticService.getTotalApplications(ownerId));
        // stats.put("totalApprovals", analyticService.getTotalApprovals(ownerId));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/count_events")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> countEvents() {
        return ResponseEntity.ok(analyticService.countEvents());
    }

    @GetMapping("/count_active_events")
    @PreAuthorize("#ownerId == authentication.name or hasRole('MANAGER')")
    public ResponseEntity<Long> countActiveEvents() {
        return ResponseEntity.ok(analyticService.countActiveEvents());
    }

    @GetMapping("/total_users")
    @PreAuthorize("#ownerId == authentication.name or hasRole('ADMIN')")
    public ResponseEntity<Long> countUsers() {
        return ResponseEntity.ok(analyticService.countUsers());
    }

}