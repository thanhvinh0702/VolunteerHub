package com.ecom.notificationservice.service.query;

import com.ecom.notificationservice.dto.NotificationEventRequest;
import com.ecom.notificationservice.repository.query.NotificationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationUserService {

    private final NotificationUserRepository notificationUserRepository;

    // TODO: delegate responsibility to different notification query fan-out handler
    public void handle(NotificationEventRequest notificationEventRequest) {
        System.out.println(notificationEventRequest);
        System.out.println("Handle...");
    }
}
