package com.ssafy.kickcap.bill.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.entity.User;
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

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "paid_status", nullable = false)
    private PaidStatus paidStatus;

    @Column(nullable = false, length = 1)
    private String field;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_idx", nullable = false)
    private Police police;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Objection> objections = new ArrayList<>();
}
