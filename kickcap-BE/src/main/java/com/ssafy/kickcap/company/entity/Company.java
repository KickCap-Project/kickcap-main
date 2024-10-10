package com.ssafy.kickcap.company.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gcooter")
public class Company {
    @Id
    @Column(name = "idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "kickboard_number", nullable = false, length = 10)
    private String kickboardNumber;

    @Column(name = "start_time", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime startTime;

    @Column(name = "end_time", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime endTime;

    @Column(name = "addr", nullable = false)
    private String address;

    @Column(name = "lat",nullable = false)
    private float latitude;

    @Column(name = "lng",nullable = false)
    private float longitude;

    @Column(nullable = false, length = 30)
    private String code;
}
