package com.ssafy.kickcap.parkingdata.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parking_data")
public class ParkingData {

    @Id
    @Column(name = "idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String gugun;

    @Column(name = "addr", nullable = false)
    private String address;

    @Column(name = "detail_addr", nullable = false)
    private String detailAddress;

    @Column(name = "lat",nullable = false)
    private double latitude;

    @Column(name = "lng",nullable = false)
    private double longitude;

}
