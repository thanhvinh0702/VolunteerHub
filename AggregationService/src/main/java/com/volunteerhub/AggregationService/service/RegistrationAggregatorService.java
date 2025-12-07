package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.EventClient;
import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.client.UserClient;
import com.volunteerhub.AggregationService.dto.AggregatedUserEventResponse;
import com.volunteerhub.common.dto.EventResponse;
import com.volunteerhub.common.dto.PageResponse;
import com.volunteerhub.common.dto.UserEventResponse;
import com.volunteerhub.common.dto.UserResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationAggregatorService {

    private final RegistrationClient registrationClient;
    private final EventClient eventClient;
    private final UserClient userClient;

    public PageResponse<AggregatedUserEventResponse> getEventRegistration(Long eventId, UserEventStatus status, Integer pageNum, Integer pageSize) {
        PageResponse<UserEventResponse> userEventResponses = registrationClient.findAllByEventId(eventId, status, pageNum, pageSize);
        List<String> userIds = userEventResponses.getContent().stream().map(UserEventResponse::getUserId).toList();
        List<UserResponse> userResponses = userClient.findAllByIds(userIds);
        Map<String, UserResponse> userMap = userResponses.stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        List<AggregatedUserEventResponse> dtoList = userEventResponses.getContent().stream()
                .map(ue -> {
                    UserResponse userResponse = userMap.getOrDefault(ue.getUserId(), UserResponse.builder().build());
                    return AggregatedUserEventResponse.builder()
                            .userEventResponse(ue)
                            .user(userResponse)
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedUserEventResponse>builder()
                .content(dtoList)
                .size(userEventResponses.getSize())
                .number(userEventResponses.getNumber())
                .totalPages(userEventResponses.getTotalPages())
                .totalElements(userEventResponses.getTotalElements())
                .build();
    }

    public PageResponse<AggregatedUserEventResponse> getAllRegistrations(UserEventStatus status, Integer pageNum, Integer pageSize) {
        PageResponse<UserEventResponse> userEventResponses = registrationClient.findAllByUserId(status, pageNum, pageSize);
        List<Long> eventIds = userEventResponses.getContent().stream().map(UserEventResponse::getEventId).toList();
        List<EventResponse> eventResponses = eventClient.getAllEventsByIds(eventIds);
        Map<Long, EventResponse> eventMap = eventResponses.stream()
                .collect(Collectors.toMap(EventResponse::getId, Function.identity()));
        List<AggregatedUserEventResponse> dtoList = userEventResponses.getContent().stream()
                .map(ue -> {
                    EventResponse eventResponse = eventMap.getOrDefault(ue.getEventId(), EventResponse.builder().build());
                    return AggregatedUserEventResponse.builder()
                            .userEventResponse(ue)
                            .event(eventResponse)
                            .build();
                })
                .toList();
        return PageResponse.<AggregatedUserEventResponse>builder()
                .content(dtoList)
                .size(userEventResponses.getSize())
                .number(userEventResponses.getNumber())
                .totalPages(userEventResponses.getTotalPages())
                .totalElements(userEventResponses.getTotalElements())
                .build();
    }
}
