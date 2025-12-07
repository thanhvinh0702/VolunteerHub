package com.volunteerhub.AggregationService.export;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.volunteerhub.AggregationService.dto.AggregatedEventResponse;
import com.volunteerhub.common.dto.AddressResponse;
import com.volunteerhub.common.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AggregationExportService {

    private final ObjectMapper objectMapper;

    public ByteArrayInputStream exportToCSV(List<AggregatedEventResponse> data) {
        String[] HEADERS = {
                "Event ID", "Event Name", "Status",
                "Category", "Location",
                "Owner Name", "Owner Email",
                "Start Time", "Capacity",
                "Total Registered", "Total Participated"
        };

        CSVFormat format = CSVFormat.DEFAULT.builder().setHeader(HEADERS).build();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             OutputStreamWriter streamWriter = new OutputStreamWriter(out, StandardCharsets.UTF_8);
             PrintWriter writer = new PrintWriter(streamWriter);
             CSVPrinter printer = new CSVPrinter(writer, format)) {

            out.write(0xEF);
            out.write(0xBB);
            out.write(0xBF);

            for (AggregatedEventResponse item : data) {
                var event = item.getEventResponse();
                var owner = item.getOwner();

                printer.printRecord(
                        event.getId(),
                        event.getName(),
                        event.getStatus(),

                        // Xử lý Category (tránh NullPointerException)
                        formatCategory(event.getCategory()),

                        // Xử lý Address (tránh NullPointerException)
                        formatAddress(event.getAddress()),

                        owner != null ? owner.getFullName() : "N/A",
                        owner != null ? owner.getEmail() : "N/A",

                        event.getStartTime(),
                        event.getCapacity(),

                        // Số liệu thống kê
                        item.getRegistrationCount(),
                        item.getParticipantCount()
                );
            }
            printer.flush();
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Export CSV failed: " + e.getMessage());
        }
    }

    public byte[] exportToJson(List<AggregatedEventResponse> data) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(data);
        } catch (IOException e) {
            throw new RuntimeException("Export JSON failed: " + e.getMessage());
        }
    }

    private String formatCategory(CategoryResponse category) {
        if (category == null) return "N/A";
        return category.getName() != null ? category.getName() : "N/A";
    }

    private String formatAddress(AddressResponse address) {
        if (address == null) return "Online/N/A";
        return address.toString();
    }
}