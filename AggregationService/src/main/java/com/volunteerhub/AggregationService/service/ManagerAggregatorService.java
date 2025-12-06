package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.EventClient;
import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.client.UserClient;
import com.volunteerhub.AggregationService.dto.ManagerRegistrationResponse;
import com.volunteerhub.common.dto.EventResponse;
import com.volunteerhub.common.dto.RegistrationResponse;
import com.volunteerhub.common.dto.UserResponse;
import com.volunteerhub.common.enums.UserEventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerAggregatorService {

    private final EventClient eventClient;
    private final RegistrationClient registrationClient;
    private final UserClient userClient;

    public List<ManagerRegistrationResponse> getManagerRegistrations(Long filterEventId, UserEventStatus status, Integer pageNum, Integer pageSize) {

        List<EventResponse> ownedEvents = eventClient.getAllOwnedEvents(null, null, null, "id", "desc");
        if (ownedEvents == null || ownedEvents.isEmpty()) return Collections.emptyList();

        Map<Long, String> eventNameMap = ownedEvents.stream()
                .collect(Collectors.toMap(EventResponse::getId, EventResponse::getName));

        List<Long> targetEventIds = getTargetEventIds(filterEventId, eventNameMap);
        if (targetEventIds.isEmpty()) return Collections.emptyList();

        List<RegistrationResponse> regList = registrationClient.getRegistrationsByEventIds(
                targetEventIds, status, pageNum, pageSize
        );

        if (regList == null || regList.isEmpty()) {
            return Collections.emptyList();
        }

        return enrichRegistrations(regList, eventNameMap);
    }

    private List<ManagerRegistrationResponse> enrichRegistrations(List<RegistrationResponse> registrations, Map<Long, String> eventNameMap) {
        List<String> userIds = registrations.stream().map(RegistrationResponse::getUserId).distinct().toList();
        List<UserResponse> users = userClient.findAllByIds(userIds);
        Map<String, UserResponse> userMap = users.stream().collect(Collectors.toMap(UserResponse::getId, Function.identity()));

        return registrations.stream()
                .map(reg -> {
                    UserResponse user = userMap.getOrDefault(reg.getUserId(), UserResponse.builder().build());
                    String eventName = eventNameMap.getOrDefault(reg.getEventId(), "Unknown Event");
                    return ManagerRegistrationResponse.builder()
                            .userDetails(user)
                            .eventName(eventName)
                            .eventId(reg.getEventId())
                            .registrationId(reg.getId())
                            .status(reg.getStatus())
                            .registeredAt(reg.getCreatedAt())
                            .build();
                })
                .toList();
    }

    private List<Long> getTargetEventIds(Long filterEventId, Map<Long, String> eventNameMap) {
        if (filterEventId != null && eventNameMap.containsKey(filterEventId)) {
            return List.of(filterEventId);
        }
        return new ArrayList<>(eventNameMap.keySet());
    }
}