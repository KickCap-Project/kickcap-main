package com.ssafy.kickcap.cctv.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.Police;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cctv_info")
public class CCTVInfo {
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

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    // Relationships
    @OneToMany(mappedBy = "cctvInfo")
    List<Crackdown> crackdowns = new ArrayList<>();
}
