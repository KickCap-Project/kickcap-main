package com.ssafy.kickcap.user.repository;

import com.ssafy.kickcap.user.entity.Police;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PoliceRepository extends JpaRepository<Police, Long> {
    Optional<Police> findByPoliceId(String policeId);
    // email로 사용자 정보를 가져옴
}