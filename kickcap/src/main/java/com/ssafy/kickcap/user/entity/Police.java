package com.ssafy.kickcap.user.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.objection.entity.Objection;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Table(name = "police")
public class Police {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 30)
    private String password;

    @Column(nullable = false)
    private String refreshToken;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Relationships
    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<DeviceInfo> deviceInfos;

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<Bill> bills;
}
