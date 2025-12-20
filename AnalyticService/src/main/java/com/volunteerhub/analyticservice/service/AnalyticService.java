package com.volunteerhub.analyticservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticService {

    private final RedisTemplate<String, Long> stringLongRedisTemplate;
    private final RestClient registrationClient;
    private final RestClient eventClient;
    private final RestClient userClient;
    private final String templateAnalytic = "analytic:";

    private <T> T getCached(String ownerId, String suffix, Supplier<T> calculator) {
        String key = templateAnalytic + (ownerId == null ? "global" : ownerId) + suffix;

        RedisTemplate<String, Object> genericTemplate = (RedisTemplate) stringLongRedisTemplate;

        Object cachedObject = genericTemplate.opsForValue().get(key);

        if (cachedObject != null) {
            return (T) cachedObject;
        }

        try {
            T realVal = calculator.get();
            if (realVal != null) {
                genericTemplate.opsForValue().set(key, realVal, Duration.ofHours(1));
            }
            return realVal;
        } catch (Exception e) {
            log.error("Error fetching analytic data for key: {}. Error: {}", key, e.getMessage());
            return null;
        }
    }

    public Long getApprovedRate() {
        return getCached(SecurityContextHolder.getContext().getAuthentication().getName()
                , ":approval_rate", () ->
                registrationClient.get()
                        .uri("/approved_rate")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long getApplicationRate() {
        return getCached(SecurityContextHolder.getContext().getAuthentication().getName(),
                ":application_rate", () ->
                registrationClient.get()
                        .uri("/application_rate")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Map<String, Long> countStatsUserId() {
        return getCached(SecurityContextHolder.getContext().getAuthentication().getName(),
                ":countStats", () ->
                registrationClient.get()
                        .uri("/my-stats/status-events")
                        .retrieve()
                        .body(new ParameterizedTypeReference<Map<String, Long>>() {}));
    }

    public Long countMyEvents() {
        return getCached(
                SecurityContextHolder.getContext().getAuthentication().getName(),
                ":total_events_mine",
                () -> eventClient.get()
                        .uri("/stats/total-events-by-manager")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countActiveEvents() {
        return getCached(SecurityContextHolder.getContext().getAuthentication().getName()
                , ":total_active_events", () ->
                eventClient.get()
                        .uri("/stats/active-events-by-manager")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countUsers() {
        return getCached("", ":total_users", () ->
                userClient.get()
                .uri("/total_users")
                .retrieve()
                .body(Long.class)
        );
    }

    public Long countManagers() {
        return getCached("", ":total_managers", () ->
                userClient.get()
                        .uri("/total_managers")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countEventsPerUser() {
        return getCached(SecurityContextHolder.getContext().getAuthentication().getName()
                , ":total_events_user", () ->
                registrationClient.get()
                        .uri("/my-stats/participated-events")
                        .retrieve()
                        .body(Long.class)
        );
    }

}