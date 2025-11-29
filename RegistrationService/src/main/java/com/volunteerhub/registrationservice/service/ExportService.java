package com.volunteerhub.registrationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.PrintWriter;

@Service
public class ExportService {

    @Autowired
    private ObjectMapper objectMapper;
    public ByteArrayInputStream exportToCSV(List<EventStatsDto> data) {
        String[] HEADERS = { "Owner ID", "Total Applications", "Approval Rate" };
        CSVFormat format = CSVFormat.DEFAULT.builder().setHeader(HEADERS).build();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter printer = new CSVPrinter(new PrintWriter(out), format)) {

            for (EventStatsDto stat : data) {
                printer.printRecord(
                        stat.getOwnerId(),
                        stat.getTotalApplications(),
                        stat.getApprovalRate() + "%" // Format dữ liệu
                );
            }
            printer.flush();
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo file CSV: " + e.getMessage());
        }
    }

    public byte[] exportToJson(List<EventStatsDto> data) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(data);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo file JSON");
        }
    }
}