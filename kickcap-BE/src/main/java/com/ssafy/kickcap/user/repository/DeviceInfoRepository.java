package com.ssafy.kickcap.user.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceInfoRepository extends JpaRepository<DeviceInfo, Long> {
    Optional<DeviceInfo> findByMemberId(Long memberId);
    Optional<DeviceInfo> findByPoliceId(Long policeId);
    Optional<DeviceInfo> findByRefreshToken(String refreshToken);
    Optional<DeviceInfo> findByFcmToken(String fcmToken);
    // FCM 토큰을 기반으로 DeviceInfo 엔티티 삭제
    void deleteByFcmToken(String fcmToken);
}
