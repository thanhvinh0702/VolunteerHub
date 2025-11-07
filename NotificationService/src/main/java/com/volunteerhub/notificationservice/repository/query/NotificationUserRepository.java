package com.volunteerhub.notificationservice.repository.query;

import com.volunteerhub.notificationservice.model.query.NotificationUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationUserRepository extends MongoRepository<NotificationUser, Long> {
}
