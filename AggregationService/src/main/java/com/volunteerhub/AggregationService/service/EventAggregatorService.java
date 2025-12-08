package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.EventClient;
import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.client.UserClient;
import com.volunteerhub.AggregationService.dto.AggregatedEventResponse;
import com.volunteerhub.AggregationService.dto.TrendingEventResponse;
import com.volunteerhub.common.dto.*;
import com.volunteerhub.common.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final UserClient userClient;

    public PageResponse<AggregatedEventResponse> getAggregatedEvents(
            Integer pageNum, Integer pageSize, EventStatus status,
            String category, LocalDateTime startAfter, LocalDateTime endBefore,
            String province, String district, String street,
            String sortedBy, String order
    ) {
        PageResponse<EventResponse> events = eventClient.getAllEvents(
                pageNum, pageSize, status, category, startAfter, endBefore,
                province, district, street, sortedBy, order
        );
        return enrichEventsPage(events);
    }

    public PageResponse<AggregatedEventResponse> getAggregatedOwnedEvents(
            Integer pageNum, Integer pageSize, EventStatus status,
            String category, LocalDateTime startAfter, LocalDateTime endBefore,
            String province, String district, String street,
            String sortedBy, String order
    ) {
        PageResponse<EventResponse> events = eventClient.getAllOwnedEvents(
                pageNum, pageSize, status, category, startAfter, endBefore,
                province, district, street, sortedBy, order
        );
        return enrichEventsPage(events);
    }

    public AggregatedEventResponse getAggregatedEventById(Long eventId) {
        EventResponse eventResponse = eventClient.getEventById(eventId);
        UserResponse userResponse = userClient.findById(eventResponse.getOwnerId());
        EventRegistrationCount totalCounts = registrationClient.getEventsParticipantCounts(List.of(eventId), null, null, null)
                .stream()
                .findFirst()
                .orElse(EventRegistrationCount.builder().eventId(eventId).registrationCount(0L).participantCount(0L).build());
        return AggregatedEventResponse.builder()
                .eventResponse(eventResponse)
                .owner(userResponse)
                .registrationCount(totalCounts.getRegistrationCount())
                .participantCount(totalCounts.getParticipantCount())
                .build();
    }

    public PageResponse<AggregatedEventResponse> searchAggregatedEvents(String keyword, Integer pageNum, Integer pageSize) {
        PageResponse<EventResponse> events = eventClient.searchEvents(keyword, pageNum, pageSize);
        return enrichEventsPage(events);
    }

    public PageResponse<AggregatedEventResponse> searchAggregatedOwnedEvents(String keyword, Integer pageNum, Integer pageSize) {
        PageResponse<EventResponse> events = eventClient.searchOwnedEvents(keyword, pageNum, pageSize);
        return enrichEventsPage(events);
    }

    public List<TrendingEventResponse> getTrendingEvents(Integer pageNum, Integer pageSize, Integer days) {
        List<EventRegistrationCount> growthCounts = registrationClient.getEventsParticipantCounts(null, pageNum, pageSize, days);

        if (growthCounts == null || growthCounts.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> eventIds = growthCounts.stream().map(EventRegistrationCount::getEventId).toList();
        List<EventResponse> eventResponses = eventClient.getAllEventsByIds(eventIds);
        List<EventRegistrationCount> totalCounts = registrationClient.getEventsParticipantCounts(eventIds, null, null, null);

        List<String> userIds = eventResponses.stream().map(EventResponse::getOwnerId).distinct().toList();
        List<UserResponse> userResponses = userClient.findAllByIds(userIds);

        Map<Long, EventRegistrationCount> totalCountMap = totalCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        Map<Long, EventRegistrationCount> growthCountMap = growthCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));
        Map<String, UserResponse> userMap = userResponses.stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return eventResponses.stream()
                .map(e -> {
                    EventRegistrationCount total = totalCountMap.getOrDefault(e.getId(), createEmptyCount(e.getId()));
                    EventRegistrationCount growth = growthCountMap.getOrDefault(e.getId(), createEmptyCount(e.getId()));
                    UserResponse user = userMap.getOrDefault(e.getOwnerId(), UserResponse.builder().build());

                    return TrendingEventResponse.builder()
                            .eventResponse(AggregatedEventResponse.builder()
                                    .owner(user)
                                    .eventResponse(e)
                                    .participantCount(total.getParticipantCount())
                                    .registrationCount(total.getRegistrationCount())
                                    .build())
                            .registrationGrowth(growth.getRegistrationCount())
                            .participantGrowth(growth.getParticipantCount())
                            .build();
                })
                .toList();
    }

    public List<UserResponse> getEventUsers(Long eventId, Integer pageNum, Integer pageSize) {
        List<String> userIds = registrationClient.findUserIdsByEventId(eventId, pageNum, pageSize);
        return userClient.findAllByIds(userIds);
    }

    private PageResponse<AggregatedEventResponse> enrichEventsPage(PageResponse<EventResponse> events) {
        if (events == null || events.getContent() == null || events.getContent().isEmpty()) {
            return PageResponse.<AggregatedEventResponse>builder()
                    .content(Collections.emptyList())
                    .totalElements(0)
                    .totalPages(0)
                    .number(events != null ? events.getNumber() : 0)
                    .size(events != null ? events.getSize() : 0)
                    .build();
        }

        List<EventResponse> content = events.getContent();

        List<Long> eventIds = content.stream()
                .map(EventResponse::getId)
                .toList();

        List<String> userIds = content.stream()
                .map(EventResponse::getOwnerId)
                .distinct()
                .toList();

        List<EventRegistrationCount> eventRegistrationCounts =
                registrationClient.getEventsParticipantCounts(eventIds, null, null, null);

        List<UserResponse> userResponses =
                userClient.findAllByIds(userIds);

        Map<Long, EventRegistrationCount> countMap = eventRegistrationCounts.stream()
                .collect(Collectors.toMap(EventRegistrationCount::getEventId, Function.identity()));

        Map<String, UserResponse> userMap = userResponses.stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        List<AggregatedEventResponse> aggregated = content.stream()
                .map(e -> {
                    EventRegistrationCount counts =
                            countMap.getOrDefault(e.getId(), createEmptyCount(e.getId()));

                    UserResponse owner =
                            userMap.getOrDefault(e.getOwnerId(), UserResponse.builder().build());

                    return AggregatedEventResponse.builder()
                            .eventResponse(e)
                            .owner(owner)
                            .registrationCount(counts.getRegistrationCount())
                            .participantCount(counts.getParticipantCount())
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedEventResponse>builder()
                .content(aggregated)
                .totalElements(events.getTotalElements())
                .totalPages(events.getTotalPages())
                .number(events.getNumber())
                .size(events.getSize())
                .build();
    }


    private EventRegistrationCount createEmptyCount(Long eventId) {
        return EventRegistrationCount.builder()
                .eventId(eventId)
                .registrationCount(0L)
                .participantCount(0L)
                .build();
    }
}