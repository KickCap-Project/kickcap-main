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

    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx", nullable = true)
    private Police police;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = true)
    private Member member;

    public Object updateRefreshToken(String newRefreshToken) {
        this.refreshToken = newRefreshToken;
        return this;
    }

    public DeviceInfo(Police police, String refreshToken) {
        this.police = police;
        this.refreshToken = refreshToken;
    }

    public DeviceInfo(Member member, String fcmToken, String refreshToken) {
        this.member = member;
        this.fcmToken = fcmToken;
        this.refreshToken = refreshToken;
    }

    public void updateFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }
}
