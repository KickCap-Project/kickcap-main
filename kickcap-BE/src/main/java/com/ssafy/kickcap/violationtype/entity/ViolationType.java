package com.ssafy.kickcap.violationtype.entity;

import com.ssafy.kickcap.cctv.entity.Crackdown;
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
    @OneToMany(mappedBy = "violationType")
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "violationType")
    private List<Crackdown> crackdowns = new ArrayList<>();

}
