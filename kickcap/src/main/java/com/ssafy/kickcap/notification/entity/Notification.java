package com.ssafy.kickcap.notification.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification")
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Column(name = "bill_idx")
    private Long billId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 1)
    private boolean isRead;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

}
