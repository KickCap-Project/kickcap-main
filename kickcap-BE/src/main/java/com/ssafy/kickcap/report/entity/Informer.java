package com.ssafy.kickcap.report.entity;

import com.ssafy.kickcap.user.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "informer")
public class Informer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false)
    private Long accusedId;

    @Column(nullable = false, length = 10)
    private String kickboardNumber;

    @Column(name = "is_sent", nullable = false, length = 1)
    private String isSent="N";

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "informer_idx", nullable = false)
    private Member member;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}
