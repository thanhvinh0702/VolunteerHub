package com.volunteerhub.AggregationService.client;

import com.volunteerhub.AggregationService.config.FeignConfig;
import com.volunteerhub.common.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "USERSERVICE", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("/api/v1/users/users/by-ids")
    List<UserResponse> findAllByIds(@RequestParam List<String> userIds);
}
