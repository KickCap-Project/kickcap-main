package com.ssafy.kickcap.user.repository;

import com.ssafy.kickcap.user.entity.DeviceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DeviceInfoRepository extends JpaRepository<DeviceInfo, Long>{
    Optional<DeviceInfo> findByMemberId(Long memberId);
    Optional<DeviceInfo> findByPoliceId(Long policeId);
    Optional<DeviceInfo> findByRefreshToken(String refreshToken);
    Optional<DeviceInfo> findByFcmToken(String fcmToken);
    Optional<DeviceInfo> findByMember_IdAndFcmToken(Long member_id, String fcmToken);

    // FCM 토큰을 기반으로 DeviceInfo 엔티티 삭제
    void deleteByPolice_IdAndFcmToken(Long id, String fcmToken);
    void deleteByMember_IdAndFcmToken(Long id, String fcmToken);

    @Modifying
    @Query("UPDATE DeviceInfo d SET d.refreshToken = null WHERE d.police.id = :policeId AND d.fcmToken = :fcmToken")
    void updatePoliceRefreshTokenToNull(@Param("policeId") Long policeId, @Param("fcmToken") String fcmToken);

    @Modifying
    @Query("UPDATE DeviceInfo d SET d.refreshToken = null WHERE d.member.id = :memberId AND d.fcmToken = :fcmToken")
    void updateMemberRefreshTokenToNull(@Param("memberId") Long policeId, @Param("fcmToken") String fcmToken);

    Optional<DeviceInfo> findByMemberIdAndFcmToken(Long id, String fcmToken);
}
