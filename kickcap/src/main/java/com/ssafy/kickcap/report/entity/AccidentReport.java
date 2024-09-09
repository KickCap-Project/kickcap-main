package com.ssafy.kickcap.report.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accident_report")
public class AccidentReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    Long id;

    @Column(name = "addr", nullable = false)
    private String address;

    @Column(name = "lat",nullable = false)
    private String latitude;

    @Column(name = "long",nullable = false)
    private String longitude;

    @Column(name = "report_time", nullable = false)
    private LocalDateTime reportTime;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "informer_idx", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx", nullable = false)
    private Police police;
}
