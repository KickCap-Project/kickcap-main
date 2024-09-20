package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.user.dto.LogoutRequest;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class DeviceInfoService {
    private final DeviceInfoRepository deviceInfoRepository;

    // 전달받은 리프레시 토큰으로 리프레시 토큰 객체를 검색해서 전달
    public DeviceInfo findByRefreshToken(String refreshToken) {
        return deviceInfoRepository.findByRefreshToken(refreshToken)
                .orElseThrow(()->new IllegalArgumentException("Unexpected token"));
    }

    public void saveOrUpdateDevice(Police police, String refreshToken, String fcmToken) {
        DeviceInfo deviceInfo = (DeviceInfo) deviceInfoRepository.findByFcmToken(fcmToken)
                .map(existingDevice -> existingDevice.updateRefreshToken(refreshToken))
                .orElse(new DeviceInfo(police, refreshToken));

        deviceInfo.updateFcmToken(fcmToken);
        deviceInfoRepository.save(deviceInfo);
    }

    // FCM 토큰과 리프레시 토큰 저장
    public void saveDevice(Member member, String fcmToken, String refreshToken) {
        DeviceInfo deviceInfo = (DeviceInfo) deviceInfoRepository.findByFcmToken(fcmToken)
                .map(info -> info.updateRefreshToken(refreshToken))
                .orElse(new DeviceInfo(member, fcmToken, refreshToken));
        deviceInfoRepository.save(deviceInfo);
    }

    // FCM 토큰으로 DeviceInfo 삭제
    @Transactional
    public void deleteByFcmToken(LogoutRequest logoutRequest) {
        DeviceInfo deviceInfo = deviceInfoRepository.findByFcmToken(logoutRequest.getFcmToken()).orElseThrow(()->new IllegalArgumentException("Unexpected token"));
        if (deviceInfo != null) {
            if(deviceInfo.getPolice()!=null) {
                deviceInfoRepository.deleteByPolice_IdAndFcmToken(deviceInfo.getPolice().getId(), logoutRequest.getFcmToken());
            } else {
                deviceInfoRepository.deleteByMember_IdAndFcmToken(deviceInfo.getMember().getId(), logoutRequest.getFcmToken());
            }
        } else {
            // 해당 FCM 토큰을 가진 엔티티가 없음
            System.out.println("No device found with the given FCM token");
        }
    }
}
