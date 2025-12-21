package com.volunteerhub.notificationservice.controller;

import com.volunteerhub.notificationservice.model.Subscription;
import com.volunteerhub.notificationservice.repository.SubscriptionRepository;
import com.volunteerhub.notificationservice.service.WebPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v1/notifications/web-push")
@RequiredArgsConstructor
public class WebPushController {
    private final WebPushService webPushService;
    private final SubscriptionRepository subscriptionRepository;

    private final List<Subscription> subscriptions = new CopyOnWriteArrayList<>();

    @GetMapping("/public-key")
    public String getPublicKey() {
        return webPushService.getPublicKey();
    }


    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody Subscription subscription) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentUserId = authentication.getName();

        if (subscriptionRepository.findByEndpoint(subscription.getEndpoint()).isPresent()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        subscription.setUserId(currentUserId);
        subscriptionRepository.save(subscription);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/broadcast")
    public ResponseEntity<Void> broadcast(@RequestBody String message) {
        List<Subscription> allSubs = subscriptionRepository.findAll();
        for (Subscription sub : allSubs) {
            webPushService.sendNotification(sub, message);
        }
        return ResponseEntity.ok().build();
    }
    @PostMapping("/test-send")
    public void sendTestMessage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        var subs = subscriptionRepository.findByUserId(authentication.getName());
        for(Subscription sub : subs) {
            webPushService.sendNotification(sub, "{\"title\": \"Test\", \"body\": \"Hello form Backend!\"}");
        }
    }
}
