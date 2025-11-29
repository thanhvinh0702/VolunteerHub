package com.volunteerhub.userservice.controller;

import com.volunteerhub.userservice.dto.UserRequest;
import com.volunteerhub.userservice.dto.UserResponse;
import com.volunteerhub.userservice.model.Role;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.model.UserBadge;
import com.volunteerhub.userservice.model.UserLoginHistory;
import com.volunteerhub.userservice.service.UserBadgeService;
import com.volunteerhub.userservice.service.UserLoginHistoryService;
import com.volunteerhub.userservice.service.UserService;
import com.volunteerhub.userservice.validation.OnCreate;
import com.volunteerhub.userservice.validation.OnUpdate;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserBadgeService userBadgeService;
    private final UserLoginHistoryService userLoginHistoryService;

    @GetMapping("/me")
    public ResponseEntity<User> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.findById(authentication.getName()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> findById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.findById(userId));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<UserBadge>> getUserBadges() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userBadgeService.findByUserId(authentication.getName()));
    }

    @GetMapping("/{userId}/badges")
    public ResponseEntity<List<UserBadge>> getUserBadgesByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(userBadgeService.findByUserId(userId));
    }

    @GetMapping("/login-history")
    public ResponseEntity<List<UserLoginHistory>> getUserLoginHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userLoginHistoryService.findByUserId(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<User> create(@Validated(OnCreate.class) @RequestBody UserRequest userRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Role role = authentication.getAuthorities().stream()
                .map(grantedAuthority -> Role.valueOf(grantedAuthority.getAuthority().replace("ROLE_", "")))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("No role found for user"));
        return new ResponseEntity<>(userService.create(authentication.getName(), role, userRequest), HttpStatus.CREATED);
//        String newUserId = UUID.randomUUID().toString();
//
//        Role defaultRole = Role.USER;
//
//        return new ResponseEntity<>(
//                userService.create(newUserId, defaultRole, userRequest),
//                HttpStatus.CREATED
//        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> update(
            @PathVariable String userId,
            @Validated(OnUpdate.class) @RequestBody UserRequest userRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>(userService.update(authentication.getName(), userRequest), HttpStatus.OK);
    }

    @GetMapping("/total_users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countUsers() {
        return ResponseEntity.ok(userService.countUsers());
    }

    @GetMapping("/total_managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countManagers() {
        return ResponseEntity.ok(userService.countManagers());
    }

    @GetMapping("/export-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> exportAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersForExport());
    }

}
