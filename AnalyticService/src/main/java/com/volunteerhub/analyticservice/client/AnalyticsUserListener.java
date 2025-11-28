package com.volunteerhub.analyticservice.client;

import com.volunteerhub.analyticservice.service.AnalyticService;
import com.volunteerhub.common.dto.message.user.UserMessage;
import com.volunteerhub.common.dto.message.user.UserRegisteredMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsUserListener {

    private final AnalyticService analyticService;

    // Nghe topic của User Service
    @KafkaListener(topics = "user-topic", groupId = "analytics-group")
    public void handleUserEvents(UserMessage message) {
        if (message instanceof UserRegisteredMessage) {
            analyticService.incrementTotalUsers();
        }
    }
}