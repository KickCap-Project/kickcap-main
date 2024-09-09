package com.ssafy.kickcap.objection.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "objection")
public class Objection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_idx", nullable = false)
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long policeIdx;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "objection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Answer answer;
}
