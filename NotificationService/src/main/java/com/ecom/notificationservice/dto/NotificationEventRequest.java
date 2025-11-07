package com.ecom.notificationservice.dto;

import com.ecom.notificationservice.model.NotificationType;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
@ToString
public class NotificationEventRequest {

    private NotificationType type;
    private String actorId;
    private String contextId;
    private Map<String, Object> payload;
}
