package com.ecom.notificationservice.repository.query;

import com.ecom.notificationservice.model.query.NotificationUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationUserRepository extends MongoRepository<NotificationUser, Long> {
}
