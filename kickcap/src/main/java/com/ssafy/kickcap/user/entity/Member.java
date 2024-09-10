package com.ssafy.kickcap.user.entity;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.notification.entity.Notification;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.entity.Informer;
import com.ssafy.kickcap.report.entity.Report;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "member")
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 10)
    private String birth;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "refresh_token", nullable = false, columnDefinition = "TEXT")
    private String refreshToken;

    @Column(nullable = false)
    private int demerit;

    // Relationships
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<DeviceInfo> deviceInfos = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Bill> bills = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Objection> objections = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<AccidentReport> accidentReports = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Crackdown> crackdowns = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Informer> informers = new ArrayList<>();
}
