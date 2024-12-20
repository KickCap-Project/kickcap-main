package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.user.dto.LogoutRequest;
import com.ssafy.kickcap.user.dto.SocialLoginResponse;
import com.ssafy.kickcap.user.dto.TokenRequest;
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
                .orElseThrow(()-> new RestApiException(ErrorCode.UNAUTHORIZED_REQUEST));
    }

    // 경찰 FCM 토큰과 리프레시 토큰 저장
    public void saveOrUpdateDevice(Police police, String refreshToken, String fcmToken) {
        DeviceInfo deviceInfo = (DeviceInfo) deviceInfoRepository.findByFcmToken(fcmToken)
                .map(existingDevice -> existingDevice.updateRefreshToken(refreshToken))
                .orElse(new DeviceInfo(police, refreshToken));

        deviceInfo.updateFcmToken(fcmToken);
        deviceInfoRepository.save(deviceInfo);
    }

    // FCM 토큰으로 DeviceInfo 삭제
    @Transactional
    public void deleteByFcmToken(Long id, LogoutRequest logoutRequest) {
        DeviceInfo deviceInfo = deviceInfoRepository.findByFcmToken(logoutRequest.getFcmToken()).orElseThrow(()-> new RestApiException(ErrorCode.UNAUTHORIZED_REQUEST));
        if (deviceInfo != null) {
            if(deviceInfo.getPolice()!=null) {
                deviceInfoRepository.deleteByPolice_IdAndFcmToken(id, logoutRequest.getFcmToken());
            } else {
                deviceInfoRepository.deleteByMember_IdAndFcmToken(id, logoutRequest.getFcmToken());
            }
        } else {
            // 해당 FCM 토큰을 가진 엔티티가 없음
            System.out.println("No device found with the given FCM token");
        }
    }
    @Transactional
    public void deleteRefreshToken(Long id, LogoutRequest logoutRequest) {
        DeviceInfo deviceInfo = deviceInfoRepository.findByFcmToken(logoutRequest.getFcmToken())
                .orElseThrow(() -> new RestApiException(ErrorCode.UNAUTHORIZED_REQUEST));

        if (deviceInfo != null && deviceInfo.getPolice() != null && deviceInfo.getPolice().getId().equals(id)) {
            deviceInfoRepository.updatePoliceRefreshTokenToNull(id, logoutRequest.getFcmToken());
        } else if (deviceInfo != null && deviceInfo.getMember() != null && deviceInfo.getMember().getId().equals(id)) {
            deviceInfoRepository.updateMemberRefreshTokenToNull(id, logoutRequest.getFcmToken());
        } else {
            System.out.println("No matching device found or device does not belong to the police user");
        }
    }

    // 일반 시민 FCM 토큰과 리프레시 토큰 저장
    public SocialLoginResponse saveFcmAndRefresh(Member member, TokenRequest tokenRequest) {
        String fcmToken = tokenRequest.getFcmToken();
        String refreshToken = tokenRequest.getRefreshToken();
        DeviceInfo deviceInfo = (DeviceInfo) deviceInfoRepository.findByMember_IdAndFcmToken(member.getId(), fcmToken)
                .map(info -> info.updateRefreshToken(refreshToken))
                .orElse(new DeviceInfo(member, fcmToken, refreshToken));

        deviceInfoRepository.save(deviceInfo);
        return SocialLoginResponse.builder().name(member.getName()).demerit(member.getDemerit()).phone(member.getPhone()).build();
    }
}
