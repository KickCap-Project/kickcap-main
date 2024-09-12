package com.ssafy.kickcap.bill.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bill")
public class Bill extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "report_idx", nullable = false)
    private Long reportId;

    @Column(nullable = false)
    private int fine;

    @Column(name = "total_bill", nullable = false)
    private int totalBill;

    @Column(nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "paid_status", nullable = false)
    private PaidStatus paidStatus;

    @Column(name = "is_obj", nullable = false, length = 1)
    private String isObjection;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx", nullable = false)
    private Police police;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Objection> objections = new ArrayList<>();
}
