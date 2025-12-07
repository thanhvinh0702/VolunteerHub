package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedEventResponse;
import com.volunteerhub.AggregationService.dto.TrendingEventResponse;
import com.volunteerhub.AggregationService.service.EventAggregatorService;
import com.volunteerhub.common.dto.PageResponse;
import com.volunteerhub.common.dto.UserResponse;
import com.volunteerhub.common.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/aggregated/events")
public class EventAggregatorController {

    private final EventAggregatorService eventAggregatorService;

    @GetMapping
    public ResponseEntity<PageResponse<AggregatedEventResponse>> getAllAggregatedEvents(@RequestParam(required = false) Integer pageNum,
                                                                                        @RequestParam(required = false) Integer pageSize,
                                                                                        @RequestParam(required = false) EventStatus status,
                                                                                        @RequestParam(required = false) String category,
                                                                                        @RequestParam(required = false) LocalDateTime startAfter,
                                                                                        @RequestParam(required = false) LocalDateTime endBefore,
                                                                                        @RequestParam(required = false) String province,
                                                                                        @RequestParam(required = false) String district,
                                                                                        @RequestParam(required = false) String street,
                                                                                        @RequestParam(defaultValue = "id") String sortedBy,
                                                                                        @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(eventAggregatorService.getAggregatedEvents(
                pageNum, pageSize, status,
                category, startAfter, endBefore,
                province, district, street,
                sortedBy, order
        ));
    }

    @GetMapping("/owned")
    public ResponseEntity<PageResponse<AggregatedEventResponse>> getAllAggregatedOwnedEvents(@RequestParam(required = false) Integer pageNum,
                                                                                             @RequestParam(required = false) Integer pageSize,
                                                                                             @RequestParam(required = false) EventStatus status,
                                                                                             @RequestParam(required = false) String category,
                                                                                             @RequestParam(required = false) LocalDateTime startAfter,
                                                                                             @RequestParam(required = false) LocalDateTime endBefore,
                                                                                             @RequestParam(required = false) String province,
                                                                                             @RequestParam(required = false) String district,
                                                                                             @RequestParam(required = false) String street,
                                                                                             @RequestParam(defaultValue = "id") String sortedBy,
                                                                                             @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(eventAggregatorService.getAggregatedOwnedEvents(
                pageNum, pageSize, status,
                category, startAfter, endBefore,
                province, district, street,
                sortedBy, order
        ));
    }

    // TODO: pagination metadata, total comments, posts, reaction, maybe need standalone service for trending computing
    @GetMapping("/trending")
    public ResponseEntity<List<TrendingEventResponse>> getAllTrendingEvents(@RequestParam(required = false) Integer pageNum,
                                                                            @RequestParam(required = false) Integer pageSize,
                                                                            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(eventAggregatorService.getTrendingEvents(pageNum, pageSize, days));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<AggregatedEventResponse>> searchEvents(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {

        return ResponseEntity.ok(eventAggregatorService.searchAggregatedEvents(keyword, pageNum, pageSize));
    }

    @GetMapping("/{eventId}/users")
    public ResponseEntity<List<UserResponse>> getUsers(@PathVariable Long eventId,
                                                          @RequestParam(required = false) Integer pageNum,
                                                          @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(eventAggregatorService.getEventUsers(eventId, pageNum, pageSize));
    }
}
