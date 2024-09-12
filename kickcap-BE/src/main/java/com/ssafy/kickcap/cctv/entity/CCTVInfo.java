package com.ssafy.kickcap.cctv.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.Police;
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
@Table(name = "cctv_info")
public class CCTVInfo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "police_idx")
    private Long policeId;

    @Column(nullable = false)
    private String location;

    @Column(name = "lat",nullable = false)
    private float latitude;

    @Column(name = "lng",nullable = false)
    private float longitude;

    // Relationships
    @OneToMany(mappedBy = "cctvInfo")
    List<Crackdown> crackdowns = new ArrayList<>();
}
