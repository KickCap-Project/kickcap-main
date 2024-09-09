package com.ssafy.kickcap.report.entity;

import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "informer")
public class Informer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false)
    private Long accusedId;

    @Column(nullable = false)
    private String kickboardNumber;

    @Column(name = "is_sent", nullable = false, length = 1)
    private String isSent;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "informer_idx", nullable = false)
    private User user;
}
