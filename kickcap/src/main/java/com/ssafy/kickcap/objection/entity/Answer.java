package com.ssafy.kickcap.objection.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obj_idx", nullable = false)
    private Objection objection;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
}
