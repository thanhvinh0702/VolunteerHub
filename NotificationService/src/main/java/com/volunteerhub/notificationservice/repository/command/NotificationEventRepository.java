package com.volunteerhub.notificationservice.repository.command;

import com.volunteerhub.notificationservice.model.command.NotificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationEventRepository extends JpaRepository<NotificationEvent, Long> {
}
