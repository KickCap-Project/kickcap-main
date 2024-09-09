package com.ssafy.kickcap.user.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "device_info")
public class DeviceInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fcmToken;

    @ManyToOne
    @JoinColumn(name = "police_idx")
    private Police police;

    @ManyToOne
    @JoinColumn(name = "user_idx")
    private User user;
}
