package com.vippro.VolunteerHubBackend.controller;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/me")
    public Authentication getUserInfo(Authentication authentication) {
        return authentication;
    }
}
