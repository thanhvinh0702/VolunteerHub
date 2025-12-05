package com.volunteerhub.userservice.controller;

import com.volunteerhub.common.dto.UserResponse;
import com.volunteerhub.common.enums.UserRole;
import com.volunteerhub.userservice.dto.UserRequest;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserBadgeService userBadgeService;
    private final UserLoginHistoryService userLoginHistoryService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.findById(authentication.getName()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> findById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.findById(userId));
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<UserResponse>> findByIds(@RequestParam List<String> userIds) {
        return ResponseEntity.ok(userService.findAllByIds(userIds));
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
    public ResponseEntity<UserResponse> create(@Validated(OnCreate.class) @RequestBody UserRequest userRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserRole role = authentication.getAuthorities().stream()
                .map(grantedAuthority -> UserRole.valueOf(grantedAuthority.getAuthority().replace("ROLE_", "")))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("No role found for user"));
        return new ResponseEntity<>(userService.create(authentication.getName(), role, userRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> update(
            @PathVariable String userId,
            @Validated(OnUpdate.class) @RequestBody UserRequest userRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>(userService.update(authentication.getName(), userRequest), HttpStatus.OK);
    }
}
