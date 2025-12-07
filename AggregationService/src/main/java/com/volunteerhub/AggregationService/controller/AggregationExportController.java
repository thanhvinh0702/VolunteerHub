package com.volunteerhub.AggregationService.controller;

import com.volunteerhub.AggregationService.dto.AggregatedEventResponse;
import com.volunteerhub.AggregationService.export.AggregationExportService;
import com.volunteerhub.AggregationService.service.EventAggregatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/aggregation/export")
@RequiredArgsConstructor
public class AggregationExportController {

    private final EventAggregatorService aggregatorService;
    private final AggregationExportService exportService;

    @GetMapping("/events/csv")
    public ResponseEntity<Resource> exportEventsCsv() {
        List<AggregatedEventResponse> data = aggregatorService.getAllAggregatedEventsForExport();

        ByteArrayInputStream stream = exportService.exportToCSV(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=aggregated_events.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/events/json")
    public ResponseEntity<byte[]> exportEventsJson() {
        List<AggregatedEventResponse> data = aggregatorService.getAllAggregatedEventsForExport();

        byte[] jsonBytes = exportService.exportToJson(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=aggregated_events.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonBytes);
    }
}