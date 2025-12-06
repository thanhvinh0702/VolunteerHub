package com.volunteerhub.AggregationService.service;

import com.volunteerhub.AggregationService.client.RegistrationClient;
import com.volunteerhub.AggregationService.client.UserClient;
import com.volunteerhub.AggregationService.dto.AggregatedUserEventResponse;
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
    private final UserClient userClient;

    public List<AggregatedUserEventResponse> getEventRegistration(Long eventId, UserEventStatus status, Integer pageNum, Integer pageSize) {
        List<UserEventResponse> userEventResponses = registrationClient.findAllByEventId(eventId, status, pageNum, pageSize);
        List<String> userIds = userEventResponses.stream().map(UserEventResponse::getUserId).toList();
        List<UserResponse> userResponses = userClient.findAllByIds(userIds);
        Map<String, UserResponse> userMap = userResponses.stream()
                .collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        return userEventResponses.stream()
                .map(ue -> {
                    UserResponse userResponse = userMap.getOrDefault(ue.getUserId(), UserResponse.builder().build());
                    return AggregatedUserEventResponse.builder()
                            .userEventResponse(ue)
                            .user(userResponse)
                            .build();
                })
                .toList();
    }
}
