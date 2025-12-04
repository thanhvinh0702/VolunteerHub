package com.volunteerhub.analyticservice.controller;

import com.volunteerhub.analyticservice.service.AnalyticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticController {

    private final AnalyticService analyticService;

    @GetMapping("/total_events_each")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> countEventsPerManager() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();
        return ResponseEntity.ok(analyticService.countEventsPerManagers(currentUserId));
    }

    @GetMapping("/current_active_events_each")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> countActiveEventsPerManager() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();
        return ResponseEntity.ok(analyticService.countActiveEventsPerManagers(currentUserId));
    }

    @GetMapping("/my_application-rate")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> getApplicationRate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();
        return ResponseEntity.ok(analyticService.getApplicationRate(currentUserId));
    }

    @GetMapping("/my-approval-rate")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> getMyApprovalRate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();
        return ResponseEntity.ok(analyticService.getApprovedRate(currentUserId));
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
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> countEvents() {
        return ResponseEntity.ok(analyticService.countEvents());
    }

    @GetMapping("/count_active_events")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> countActiveEvents() {
        return ResponseEntity.ok(analyticService.countActiveEvents());
    }

    @GetMapping("/total_users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countUsers() {
        return ResponseEntity.ok(analyticService.countUsers());
    }

    @GetMapping("/total_managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countManagers() {
        return ResponseEntity.ok(analyticService.countManagers());
    }
}