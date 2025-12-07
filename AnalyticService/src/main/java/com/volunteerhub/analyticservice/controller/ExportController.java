//package com.volunteerhub.analyticservice.controller;
//
//import com.volunteerhub.analyticservice.dto.UserExportDto;
//import com.volunteerhub.analyticservice.service.AnalyticService;
//import com.volunteerhub.analyticservice.service.ExportService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.core.io.InputStreamResource;
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.ByteArrayInputStream;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/exports")
//@RequiredArgsConstructor
//public class ExportController {
//
//    private final ExportService exportService;
//    private final AnalyticService analyticService; // Service để lấy List data gốc
//
//    @GetMapping("/users")
//    public ResponseEntity<Resource> exportUsers() {
//        List<UserExportDto> users = analyticService.getAllUsersForExport();
//
//        ByteArrayInputStream stream = exportService.exportUsersToCSV(users);
//
//        // Bước 3: Trả về file cho trình duyệt tải xuống
//        return generateResponse(stream, "users_export.csv");
//    }
//
//    // 2. API Xuất danh sách Events
//    @GetMapping("/events")
//    public ResponseEntity<Resource> exportEvents() {
//        // Giả sử bạn có hàm lấy list events
//        // List<EventExportDto> events = analyticService.getAllEventsForExport();
//        // ByteArrayInputStream stream = exportService.exportEventsToCSV(events);
//        // return generateResponse(stream, "events_export.csv");
//        return null; // Demo
//    }
//
//    // --- Hàm phụ trợ để đóng gói file trả về ---
//    private ResponseEntity<Resource> generateResponse(ByteArrayInputStream stream, String fileName) {
//        InputStreamResource file = new InputStreamResource(stream);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
//                .contentType(MediaType.parseMediaType("application/csv"))
//                .body(file);
//    }
//}