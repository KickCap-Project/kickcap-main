package com.ssafy.kickcap.user.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.objection.entity.Objection;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "police")
public class Police {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 30)
    private String password;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String refreshToken;

    // Relationships
    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DeviceInfo> deviceInfos;

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bill> bills;
}
