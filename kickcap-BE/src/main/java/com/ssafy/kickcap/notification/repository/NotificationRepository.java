package com.ssafy.kickcap.notification.repository;

import com.ssafy.kickcap.notification.entity.Notification;
import com.ssafy.kickcap.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.member = :member AND n.isRead <> 'Y' OR (n.isRead = 'Y' AND n.createdAt >= :sevenDaysAgo) ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsExcludingOldRead(Member member, ZonedDateTime sevenDaysAgo);
}
