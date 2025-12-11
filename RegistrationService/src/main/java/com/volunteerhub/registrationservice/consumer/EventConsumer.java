package com.volunteerhub.registrationservice.consumer;

import com.volunteerhub.common.dto.message.event.EventApprovedMessage;
import com.volunteerhub.common.dto.message.event.EventDeletedMessage;
import com.volunteerhub.common.dto.message.event.EventMessage;
import com.volunteerhub.common.dto.message.event.EventUpdatedMessage;
import com.volunteerhub.registrationservice.config.RabbitMQConfig;
import com.volunteerhub.registrationservice.dto.EventSnapshotRequest;
import com.volunteerhub.registrationservice.service.EventSnapshotService;
import com.volunteerhub.registrationservice.service.UserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final EventSnapshotService eventSnapshotService;
    private final UserEventService userEventService;

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
        else if (eventMessage instanceof EventUpdatedMessage) {
            try {
                if (((EventUpdatedMessage) eventMessage).getUpdatedFields().containsKey("capacity")) {
                    EventSnapshotRequest eventSnapshotRequest = EventSnapshotRequest
                            .builder()
                            .eventId(((EventUpdatedMessage) eventMessage).getId())
                            .capacity((Integer) ((EventUpdatedMessage) eventMessage).getUpdatedFields().get("capacity"))
                            .build();
                    eventSnapshotService.update(eventSnapshotRequest);
                }
            }
            catch (Exception e) {
                System.out.println("FAILED TO UPDATE EVENT SNAPSHOT WITH ID " + ((EventUpdatedMessage) eventMessage).getId());
            }
        }
        else if (eventMessage instanceof EventDeletedMessage) {
            try {
                eventSnapshotService.delete(((EventDeletedMessage) eventMessage).getEventId());
            } catch (Exception e) {
                System.out.println("FAILED TO DELETE EVENT SNAPSHOT WITH ID " + ((EventDeletedMessage) eventMessage).getEventId());
            }
        }
    }

}
