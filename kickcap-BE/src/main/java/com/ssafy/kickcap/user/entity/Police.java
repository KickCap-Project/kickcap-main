package com.ssafy.kickcap.user.entity;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.common.BaseEntity;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.entity.Report;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "police")
@Builder
public class Police extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name = "police_id", nullable = false, length = 30)
    private String policeId;

    @Column(nullable = false, length = 30, columnDefinition = "TEXT")
    private String password;

    // Relationships.
    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<DeviceInfo> deviceInfos = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<Bill> bills = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<AccidentReport> accidentReports = new ArrayList<>();

    @OneToMany(mappedBy = "police", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    @Override //사용자가 가지고 있는 권한의 목록을 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_POLICE"));
    }

    // 사용자의 id를 반환 (사용자를 식별할 수 있는 고유한 값 unique)
    @Override
    public String getUsername() {
        return policeId;
    }

    // 사용자의 패스워드 반환
    @Override
    public String getPassword() {
        return password;
    }

    // 계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        // 만료되었는지 확인하는 로직
        return true;
    }

    // 계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        // 잠금되었는지 확인하는 로직
        return true;
    }
}
