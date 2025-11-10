package com.volunteerhub.registrationservice.consumer;

import com.volunteerhub.common.dto.message.event.EventApprovedMessage;
import com.volunteerhub.common.dto.message.event.EventMessage;
import com.volunteerhub.registrationservice.config.RabbitMQConfig;
import com.volunteerhub.registrationservice.dto.EventSnapshotRequest;
import com.volunteerhub.registrationservice.service.EventSnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final EventSnapshotService eventSnapshotService;

    @RabbitListener(queues = RabbitMQConfig.EVENT_QUEUE)
    private void handleEvent(EventMessage eventMessage) {
        if (eventMessage instanceof EventApprovedMessage) {
            EventSnapshotRequest eventSnapshotRequest = EventSnapshotRequest
                    .builder()
                    .eventId(((EventApprovedMessage) eventMessage).getEventId())
                    .capacity(((EventApprovedMessage) eventMessage).getCapacity())
                    .status(((EventApprovedMessage) eventMessage).getStatus())
                    .ownerId(((EventApprovedMessage) eventMessage).getOwnerId())
                    .build();
            eventSnapshotService.create(eventSnapshotRequest);
        }
    }

}
