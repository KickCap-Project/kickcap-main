package com.ssafy.kickcap.report.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "report")
public class Report extends BaseEntity {

    @Id
    @Column(name = "idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_src", columnDefinition = "TEXT", nullable = false)
    private String imageSrc;

    @Column(nullable = false)
    private String address;

    @Column(name = "lat",nullable = false)
    private float latitude;

    @Column(name = "long",nullable = false)
    private float longitude;

    @Column(name = "kickboard_number", nullable = false)
    private String kickboardNumber;

    @Column(name = "report_time", nullable = false)
    private LocalDateTime reportTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "approve_status", nullable = false)
    private ApproveStatus approveStatus;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accused_idx", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx", nullable = false)
    private Police police;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "violation_type", nullable = false)
    private ViolationType violationType;

}
