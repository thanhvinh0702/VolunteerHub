package com.volunteerhub.analyticservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "registrationService",
        url = "${service.registration.url}", // cấu hình trong application.yml
        configuration = RegistrationFeignConfig.class
)
public interface RegistrationClient {

    @GetMapping("/event/{ownerId}/application_rate")
    Long getApplicationRate(@PathVariable("ownerId") String ownerId);

    @GetMapping("/event/{ownerId}/approved_rate")
    Long getApprovedRate(@PathVariable("ownerId") String ownerId);
}