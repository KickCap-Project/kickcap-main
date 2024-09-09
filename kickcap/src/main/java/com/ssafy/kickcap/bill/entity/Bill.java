package com.ssafy.kickcap.bill.entity;
import com.ssafy.kickcap.notification.entity.Notification;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "police_idx", nullable = false)
    private Police police;

    @Column(nullable = false)
    private String reportType;

    @Column(nullable = false)
    private int fine;

    @Column(nullable = false)
    private int totalBill;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaidStatus paidStatus;

    @Column(nullable = false, length = 1)
    private String field;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Objection> objections;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Notification> notifications;

    // Enum for Paid Status
    public enum PaidStatus {
        UNPAID, PAID, CANCEL
    }
}
