package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedEventResponse;
import com.volunteerhub.AggregationService.dto.TrendingEventResponse;
import com.volunteerhub.AggregationService.service.EventAggregatorService;
import com.volunteerhub.common.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/aggregated/events")
public class EventAggregatorController {

    private final EventAggregatorService eventAggregatorService;

    @GetMapping
    public ResponseEntity<List<AggregatedEventResponse>> getAllAggregatedEvents(@RequestParam(required = false) Integer pageNum,
                                                                                @RequestParam(required = false) Integer pageSize,
                                                                                @RequestParam(required = false) EventStatus status,
                                                                                @RequestParam(defaultValue = "id") String sortedBy,
                                                                                @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(eventAggregatorService.getAggregatedEvents(pageNum, pageSize, status, sortedBy, order));
    }

    @GetMapping("/owned")
    public ResponseEntity<List<AggregatedEventResponse>> getAllAggregatedOwnedEvents(@RequestParam(required = false) Integer pageNum,
                                                                                     @RequestParam(required = false) Integer pageSize,
                                                                                     @RequestParam(required = false) EventStatus status,
                                                                                     @RequestParam(defaultValue = "id") String sortedBy,
                                                                                     @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(eventAggregatorService.getAggregatedOwnedEvents(pageNum, pageSize, status, sortedBy, order));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<TrendingEventResponse>> getAllTrendingEvents(@RequestParam(required = false) Integer pageNum,
                                                                            @RequestParam(required = false) Integer pageSize,
                                                                            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(eventAggregatorService.getTrendingEvents(pageNum, pageSize, days));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AggregatedEventResponse>> searchEvents(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {

        return ResponseEntity.ok(eventAggregatorService.searchAggregatedEvents(keyword, pageNum, pageSize));
    }
}
