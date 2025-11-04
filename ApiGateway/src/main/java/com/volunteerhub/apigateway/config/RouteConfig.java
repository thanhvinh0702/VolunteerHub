package com.volunteerhub.apigateway.config;

import com.volunteerhub.apigateway.filter.AuthenticationHeaderFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.web.servlet.function.RequestPredicates;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

@Configuration
public class RouteConfig {
    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return route("userservice")
                .nest(RequestPredicates.path("/api/v1/users/**"), builder ->
                        builder
                                .GET(http())
                                .POST(http())
                                .PUT(http())
                                .DELETE(http())
                                .filter(lb("USERSERVICE"))
                                .before(AuthenticationHeaderFilter.addAuthenticationHeader())
                )
                .build();
    }
}
