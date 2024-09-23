package com.ssafy.kickcap.violationtype.entity;

import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.report.entity.Report;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "violation_type")
public class ViolationType{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false)
    private int fine;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false)
    private int score;

    // Relationships
    @OneToOne(mappedBy = "violationType")
    private Report report;

    @OneToOne(mappedBy = "violationType")
    private Crackdown crackdown;

}
