package com.volunteerhub.communityservice.service;

import com.volunteerhub.communityservice.model.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventRegistrationService {

    // TODO: call registration service api to check
    public boolean isParticipant(String userId, Long eventId) {
        return true;
    }
}
