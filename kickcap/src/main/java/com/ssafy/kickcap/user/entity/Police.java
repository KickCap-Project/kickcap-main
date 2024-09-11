package com.ssafy.kickcap.user.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.entity.Report;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "police")
public class Police extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name = "police_id", nullable = false, length = 30)
    private String policeId;

    @Column(nullable = false, length = 30)
    private String password;

    @Column(name = "refresh_token", nullable = false, columnDefinition = "TEXT")
    private String refreshToken;

    // Relationships
    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<DeviceInfo> deviceInfos = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<Bill> bills = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<AccidentReport> accidentReports = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();


}
