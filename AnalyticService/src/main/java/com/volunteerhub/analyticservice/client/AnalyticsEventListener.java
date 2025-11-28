package com.volunteerhub.analyticservice.client;

import com.volunteerhub.analyticservice.service.AnalyticService;
import com.volunteerhub.common.dto.message.event.*; // Import hết các message
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsEventListener {

    private final AnalyticService analyticService;

    @KafkaListener(topics = "event-topic", groupId = "analytics-group")
    public void handleEventChanges(EventMessage message) {

        if (message instanceof EventCreatedMessage msg) {
            analyticService.incrementTotalEvents();
            System.out.println("New event created by: " + msg.getOwnerId());
        }

        else if (message instanceof EventRejectedMessage msg) {
            analyticService.decrementTotalEvents();
            System.out.println("Event deleted: " + msg.getEventId());
        }

        // 3. Khi Admin duyệt sự kiện
        else if (message instanceof EventApprovedMessage msg) {
            System.out.println("Event approved: " + msg.getEventId());
        }

        // 4. Khi Admin từ chối sự kiện
        else if (message instanceof EventRejectedMessage msg) {
            System.out.println("Event rejected reason: " + msg.getReason());
            // Tùy logic: Nếu Rejected nghĩa là không được tính vào tổng nữa thì gọi decrement
            // analyticService.decrementTotalEvents();
        } else if (message instanceof EventUpdatedMessage msg) {
            if (msg.getUpdatedFields().containsKey("capacity")) {
                analyticService.updateCapacityCount(msg.getOwnerId(), (Integer)msg.getUpdatedFields().get("capacity"));
            }
        }
    }
}