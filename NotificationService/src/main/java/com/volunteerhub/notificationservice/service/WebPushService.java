package com.volunteerhub.notificationservice.service;


import com.volunteerhub.notificationservice.model.Subscription;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;

@Service
@RequiredArgsConstructor
public class WebPushService {
    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    @Value("${vapid.subject}")
    private String subject;

    public String getPublicKey() {
        return publicKey;
    }

    private PushService pushService;

    @PostConstruct
    private void init() throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        pushService = new PushService(publicKey, privateKey, subject);
    }

    public void sendNotification(Subscription subscription, String messageJson) {
        try {
            Notification notification = new Notification(
                    subscription.getEndpoint(),
                    subscription.getKeys().getP256dh(),
                    subscription.getKeys().getAuth(),
                    messageJson.getBytes()
            );
            pushService.send(notification);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
