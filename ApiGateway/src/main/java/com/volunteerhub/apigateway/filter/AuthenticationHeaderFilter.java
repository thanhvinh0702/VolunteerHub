package com.volunteerhub.apigateway.filter;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.function.ServerRequest;

import java.util.function.Function;

public class AuthenticationHeaderFilter {

    public static Function<ServerRequest, ServerRequest> addAuthenticationHeader() {
        return request -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                String userId = authentication.getName();
                String role = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst()
                        .orElse("");
                return ServerRequest.from(request)
                        .header("X-USER-ID", userId)
                        .header("X-USER-ROLE", role)
                        .build();
            }
            return request;
        };
    }
}
