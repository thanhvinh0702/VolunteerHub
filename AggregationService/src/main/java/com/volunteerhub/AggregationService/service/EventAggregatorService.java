package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.EventClient;
import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.dto.EventWithRegistrationCountResponse;
import com.volunteerhub.common.dto.EventRegistrationCount;
import com.volunteerhub.common.dto.EventResponse;
import com.volunteerhub.common.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventAggregatorService {

    private final EventClient eventClient;
    private final RegistrationClient registrationClient;

    public List<EventWithRegistrationCountResponse> getAggregatedEvents(
            Integer pageNum, Integer pageSize, EventStatus status, String sortedBy, String order) {
        List<EventResponse> events = eventClient.getAllEvents(pageNum, pageSize, status, sortedBy, order);
        List<Long> eventIds = events.stream().map(EventResponse::getId).toList();
        List<EventRegistrationCount> eventRegistrationCounts = registrationClient.getEventsParticipantCounts(eventIds);
        Map<Long, Long> countMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, EventRegistrationCount::getCount));
        return events.stream()
                .map(e -> EventWithRegistrationCountResponse.builder()
                        .eventResponse(e)
                        .registrationCount(countMap.getOrDefault(e.getId(), 0L))
                        .build())
                .toList();
    }

    public List<EventWithRegistrationCountResponse> getAggregatedOwnedEvents(
            Integer pageNum, Integer pageSize, EventStatus status, String sortedBy, String order) {
        List<EventResponse> events = eventClient.getAllOwnedEvents(pageNum, pageSize, status, sortedBy, order);
        List<Long> eventIds = events.stream().map(EventResponse::getId).toList();
        List<EventRegistrationCount> eventRegistrationCounts = registrationClient.getEventsParticipantCounts(eventIds);
        Map<Long, Long> countMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, EventRegistrationCount::getCount));
        return events.stream()
                .map(e -> EventWithRegistrationCountResponse.builder()
                        .eventResponse(e)
                        .registrationCount(countMap.getOrDefault(e.getId(), 0L))
                        .build())
                .toList();
    }
}
