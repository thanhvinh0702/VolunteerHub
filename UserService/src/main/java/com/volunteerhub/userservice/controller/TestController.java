package com.volunteerhub.userservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/users/test")
    public String helloUser(Authentication authentication) {
        return "Hello User " + authentication.getName();
    }

    @GetMapping("/admin/test")
    public String helloAdmin(Authentication authentication) {
        return "Hello Admin " +authentication.getName();
    }
}
