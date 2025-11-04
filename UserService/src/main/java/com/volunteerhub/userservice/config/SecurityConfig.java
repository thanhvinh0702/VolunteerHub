package com.volunteerhub.userservice.config;

import com.volunteerhub.userservice.security.CustomAuthenticationManagerResolver;
import com.volunteerhub.userservice.security.CustomJwtAuthenticationConverter;
import com.volunteerhub.userservice.security.GoogleJwtAuthenticationConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Value("${spring.security.oauth2.google.issuer}")
    private String googleIssuer;
    @Value("${spring.security.oauth2.google.jwk-uri}")
    private String googleJwkUri;
    @Value("${spring.security.oauth2.volunteerhub.issuer}")
    private String volunteerHubIssuer;
    @Value("${spring.security.oauth2.volunteerhub.jwk-uri}")
    private String volunteerHubJwkUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.oauth2ResourceServer(j -> j
                .authenticationManagerResolver(
                        new CustomAuthenticationManagerResolver(
                                new CustomJwtAuthenticationConverter(),
                                new GoogleJwtAuthenticationConverter(),
                                googleIssuer, googleJwkUri,
                                volunteerHubIssuer, volunteerHubJwkUri)
                )
        );
        http.authorizeHttpRequests(
                c -> c.requestMatchers("/users/test").hasRole("USER")
                        .requestMatchers("/admin/test").hasRole("ADMIN")
                        .anyRequest().authenticated()
        );
        return http.build();
    }

}