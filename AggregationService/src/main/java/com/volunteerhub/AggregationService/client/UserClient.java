package com.volunteerhub.AggregationService.client;

import com.volunteerhub.AggregationService.config.FeignConfig;
import com.volunteerhub.common.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "USERSERVICE", path = "/api/v1/users/users", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("/{userId}")
    UserResponse findById(@PathVariable String userId);

    @GetMapping("/by-ids")
    List<UserResponse> findAllByIds(@RequestParam List<String> userIds);
}
