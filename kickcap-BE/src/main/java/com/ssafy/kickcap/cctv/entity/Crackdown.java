package com.ssafy.kickcap.cctv.entity;

import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.ZonedDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "crackdown")
public class Crackdown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "image_src", nullable = false)
    private String imageSrc;

    @Column(name = "crackdown_time", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime crackdownTime;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cctv_idx", nullable = false)
    private CCTVInfo cctvInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accused_idx", nullable = false)
    private Member member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type", nullable = false)
    private ViolationType violationType;
}
