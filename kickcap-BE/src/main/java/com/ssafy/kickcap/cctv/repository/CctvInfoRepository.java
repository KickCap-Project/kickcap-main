package com.ssafy.kickcap.cctv.repository;

import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CctvInfoRepository extends JpaRepository<CCTVInfo, Long> {
    Optional<CCTVInfo> findById(Long id);
}
