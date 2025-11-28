package com.volunteerhub.analyticservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
public class AnalyticService {

    private final RedisTemplate<String, Long> stringLongRedisTemplate;
    private final RestClient registrationClient;
    private final RestClient eventClient;
    private final RestClient userClient;
    private final String templateAnalytic = "analytic:";

    private Long getCached(String ownerId, String suffix, Supplier<Long> calculator) {
        String key = templateAnalytic + ownerId + suffix;

        Long cachedVal = stringLongRedisTemplate.opsForValue().get(key);
        if (cachedVal != null) return cachedVal;

        try {
            Long realVal = calculator.get();
            if (realVal == null) realVal = 0L;

            stringLongRedisTemplate.opsForValue().set(key, realVal, Duration.ofHours(1));
            return realVal;
        } catch (Exception e) {
            return 0L;
        }
    }

    public Long getApprovedRate(String ownerId) {
        return getCached(ownerId, ":approval_rate", () ->
                registrationClient.get()
                        .uri("/event/{ownerId}/approved_rate", ownerId)
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long getApplicationRate(String ownerId) {
        return getCached(ownerId, ":approval_rate", () ->
                registrationClient.get()
                        .uri("/event/{ownerId}/approved_rate", ownerId)
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countEventsPerManagers(String ownerId) {
        return getCached(ownerId, ":total_events_each", () ->
                registrationClient.get()
                        .uri("/{ownerId}/total_events_each", ownerId)
                .retrieve()
                .body(Long.class));
    }

    public Long countActiveEventsPerManagers(String ownerId) {
        return getCached(ownerId, ":current_active_events_each", () ->
                registrationClient.get()
                        .uri("/{ownerId}/current_active_events", ownerId)
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countEvents() {
        return getCached("", ":total_events", () ->
                eventClient.get()
                        .uri("/total_events")
                        .retrieve()
                        .body(Long.class)
        );
    }

    public Long countActiveEvents() {
        return getCached("", ":total_active_events", () ->
                eventClient.get()
                        .uri("/total_active_events")
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

    public Long count
}