package com.ssafy.kickcap.user.entity;
import com.ssafy.kickcap.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "device_info")
public class DeviceInfo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "fcm_token", nullable = false, columnDefinition = "TEXT")
    private String fcmToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx")
    private Police police;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;
}
