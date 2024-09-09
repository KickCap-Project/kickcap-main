package com.ssafy.kickcap.user.entity;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "device_info")
public class DeviceInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(nullable = false)
    private String fcmToken;

    @ManyToOne
    @JoinColumn(name = "police_idx")
    private Police police;

    @ManyToOne
    @JoinColumn(name = "user_idx")
    private User user;
}
