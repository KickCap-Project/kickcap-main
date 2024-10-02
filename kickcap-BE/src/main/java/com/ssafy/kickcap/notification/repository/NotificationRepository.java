package com.ssafy.kickcap.notification.repository;

import com.ssafy.kickcap.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
