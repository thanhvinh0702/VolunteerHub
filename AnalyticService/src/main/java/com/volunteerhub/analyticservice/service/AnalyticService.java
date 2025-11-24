package com.volunteerhub.analyticservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticService {
    private final RedisTemplate<String, Integer> stringIntegerRedisTemplate;

    public Integer getTotalEvents() {
        String key = "analytic:event:total";

        Integer total = stringIntegerRedisTemplate.opsForValue().get(key);
        return total != null ? total : 0;
    }

    public Integer getTotalUsers() {
        String key = "analytic:user:total";
        Integer total = stringIntegerRedisTemplate.opsForValue().get(key);
        return total != null ? total : 0;
    }

    public Integer updateApplicationRateCache(String ownerId) {
        String key = "analytic:owner:" + ownerId + ":rate_application";

        Integer total = stringIntegerRedisTemplate.opsForValue().get(key);
        return total != null ? total : 0;
    }

    public Integer updateApprovalRateCache(String ownerId) {
        String key = "analytic:owner:" + ownerId + ":approval_rate";

        Integer total = stringIntegerRedisTemplate.opsForValue().get(key);
        return total != null ? total : 0;
    }
}
