package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.EventClient;
import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.dto.EventWithRegistrationCountResponse;
import com.volunteerhub.AggregationService.dto.TrendingEventResponse;
import com.volunteerhub.common.dto.EventRegistrationCount;
import com.volunteerhub.common.dto.EventResponse;
import com.volunteerhub.common.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventAggregatorService {

    private final EventClient eventClient;
    private final RegistrationClient registrationClient;

    public List<EventWithRegistrationCountResponse> getAggregatedEvents(Integer pageNum, Integer pageSize, EventStatus status, String sortedBy, String order) {
        List<EventResponse> events = eventClient.getAllEvents(pageNum, pageSize, status, sortedBy, order);
        List<Long> eventIds = events.stream().map(EventResponse::getId).toList();
        List<EventRegistrationCount> eventRegistrationCounts = registrationClient.getEventsParticipantCounts(eventIds, null, null, null);
        Map<Long, EventRegistrationCount> countMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        return events.stream()
                .map(e -> {
                    EventRegistrationCount counts = countMap.getOrDefault(e.getId(),
                            EventRegistrationCount.builder()
                                    .eventId(e.getId())
                                    .registrationCount(0L)
                                    .participantCount(0L)
                                    .build());

                    return EventWithRegistrationCountResponse.builder()
                            .eventResponse(e)
                            .registrationCount(counts.getRegistrationCount())
                            .participantCount(counts.getParticipantCount())
                            .build();
                })
                .toList();
    }

    public List<EventWithRegistrationCountResponse> getAggregatedOwnedEvents(Integer pageNum, Integer pageSize, EventStatus status, String sortedBy, String order) {
        List<EventResponse> events = eventClient.getAllOwnedEvents(pageNum, pageSize, status, sortedBy, order);
        List<Long> eventIds = events.stream().map(EventResponse::getId).toList();
        List<EventRegistrationCount> eventRegistrationCounts = registrationClient.getEventsParticipantCounts(eventIds, null, null, null);
        Map<Long, EventRegistrationCount> countMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        return events.stream()
                .map(e -> {
                    EventRegistrationCount counts = countMap.getOrDefault(e.getId(),
                            EventRegistrationCount.builder()
                                    .eventId(e.getId())
                                    .registrationCount(0L)
                                    .participantCount(0L)
                                    .build());

                    return EventWithRegistrationCountResponse.builder()
                            .eventResponse(e)
                            .registrationCount(counts.getRegistrationCount())
                            .participantCount(counts.getParticipantCount())
                            .build();
                })
                .toList();
    }

    public List<TrendingEventResponse> getTrendingEvents(Integer pageNum, Integer pageSize, Integer days) {
        List<EventRegistrationCount> eventRegistrationCounts = registrationClient.getEventsParticipantCounts(null, pageNum, pageSize, days);
        if (eventRegistrationCounts == null || eventRegistrationCounts.isEmpty()) {
            return Collections.emptyList();
        }
        List<Long> eventIds = eventRegistrationCounts.stream().map(EventRegistrationCount::getEventId).toList();
        List<EventResponse> eventResponses = eventClient.getAllEventsByIds(eventIds);
        List<EventRegistrationCount> allEventRegistrationCounts = registrationClient.getEventsParticipantCounts(eventIds, null, null, null);
        Map<Long, EventRegistrationCount> countMap = allEventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        Map<Long, EventRegistrationCount> growthCountMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        return eventResponses.stream()
                .map(e -> {
                    EventRegistrationCount counts = countMap.getOrDefault(e.getId(),
                            EventRegistrationCount.builder()
                                    .eventId(e.getId())
                                    .registrationCount(0L)
                                    .participantCount(0L)
                                    .build());

                    EventRegistrationCount growthCounts = growthCountMap.getOrDefault(e.getId(),
                            EventRegistrationCount.builder()
                                    .eventId(e.getId())
                                    .registrationCount(0L)
                                    .participantCount(0L)
                                    .build());

                    return TrendingEventResponse.builder()
                            .eventResponse(e)
                            .registrationCount(counts.getRegistrationCount())
                            .participantCount(counts.getParticipantCount())
                            .registrationGrowth(growthCounts.getRegistrationCount())
                            .participantGrowth(growthCounts.getParticipantCount())
                            .build();
                })
                .toList();
    }
}
