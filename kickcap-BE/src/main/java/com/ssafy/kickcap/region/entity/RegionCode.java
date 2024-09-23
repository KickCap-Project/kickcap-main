package com.ssafy.kickcap.region.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "region_code")
public class RegionCode {
    @Id
    @Column(name = "idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String code;

    @Column(nullable = false, length = 30)
    private String si;

    @Column(length = 30)
    private String gugun;

    @Column(length = 30)
    private String eupmyeondong;

    @Column(nullable = false, name = "station_idx")
    private Long stationIdx;
}
