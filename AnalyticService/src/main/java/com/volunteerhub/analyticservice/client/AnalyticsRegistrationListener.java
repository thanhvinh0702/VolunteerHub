package com.volunteerhub.analyticservice.client;

import com.volunteerhub.analyticservice.service.AnalyticService;
import com.volunteerhub.common.dto.message.registration.RegistrationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsRegistrationListener {

    private final AnalyticService analyticService;

    @KafkaListener(topics = "registration-events", groupId = "analytics-group")
    public void handleRegistrationChanges(RegistrationMessage message) {
        String ownerId = message.getOwnerId();

        switch (message.getType()) {
            case CREATED:
                analyticService.updateApplicationCount(ownerId, true);
                break;
            case APPROVED:
                analyticService.updateApprovalCount(ownerId, true);
                break;
            case DELETED:
                analyticService.updateApplicationCount(ownerId, false);
                break;
        }
    }
}