package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public void deleteByFcmToken(String fcmToken) {
        deviceInfoRepository.deleteByFcmToken(fcmToken);
    }
}
