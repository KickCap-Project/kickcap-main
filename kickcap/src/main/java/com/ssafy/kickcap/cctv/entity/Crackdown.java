package com.ssafy.kickcap.cctv.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.User;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "crackdown")
public class Crackdown extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "image_src", nullable = false)
    private String imageSrc;

    @Column(name = "crackdown_time", nullable = false)
    private LocalDateTime crackdownTime;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cctv_idx", nullable = false)
    private CCTVInfo cctvInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accused_idx", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type", nullable = false)
    private ViolationType type;
}
