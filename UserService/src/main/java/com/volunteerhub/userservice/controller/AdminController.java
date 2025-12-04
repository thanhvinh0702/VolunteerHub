package com.volunteerhub.userservice.controller;

import com.volunteerhub.userservice.dto.response.UserResponse;
import com.volunteerhub.userservice.model.User;
import com.volunteerhub.userservice.model.UserLoginHistory;
import com.volunteerhub.userservice.service.UserLoginHistoryService;
import com.volunteerhub.userservice.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/admin")
@AllArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserLoginHistoryService userLoginHistoryService;

    @GetMapping("/all-users")
    public ResponseEntity<List<UserResponse>> findAll(@RequestParam(required = false) Integer page,
                                                      @RequestParam(required = false) Integer pageSize) {
        return ResponseEntity.ok(userService.findAll(page, pageSize));
    }

    @GetMapping("/{userId}/login-history")
    public ResponseEntity<List<UserLoginHistory>> findByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(userLoginHistoryService.findByUserId(userId));
    }

    @PatchMapping("/{userId}/lock")
    public ResponseEntity<User> lockUser(@PathVariable String userId) {
        User updatedUser = userService.lockUser(userId);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{userId}/unlock")
    public ResponseEntity<User> unlockUser(@PathVariable String userId) {
        User updatedUser = userService.unlockUser(userId);
        return ResponseEntity.ok(updatedUser);
    }

}
