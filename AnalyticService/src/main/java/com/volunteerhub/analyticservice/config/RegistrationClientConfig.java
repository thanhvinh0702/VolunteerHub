package com.volunteerhub.analyticservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestClient;

import java.util.stream.Collectors;

@Configuration
public class RegistrationClientConfig {

    @Bean("registrationClient")
    public RestClient registrationClient(RestClient.Builder builder) {
        return builder
                .baseUrl("http://localhost:8081")
                .requestInterceptor(authPropagationInterceptor())
                .build();
    }

    private ClientHttpRequestInterceptor authPropagationInterceptor() {
        return (request, body, execution) -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                String userId = (String) authentication.getPrincipal();

                String roles = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(","));

                request.getHeaders().add("X-USER-ID", userId);
                request.getHeaders().add("X-USER-ROLE", roles);
            }

            return execution.execute(request, body);
        };
    }
}