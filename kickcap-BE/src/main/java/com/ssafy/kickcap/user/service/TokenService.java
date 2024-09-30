package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final TokenProvider tokenProvider;
    private final DeviceInfoService refreshTokenService;
    private final PoliceService userService;

    public String createNewAccessToken(String refreshToken) {
        // 토큰 유효성 검사에 실패하면 예외 발생
        if (!tokenProvider.validToken(refreshToken)){
            throw new IllegalArgumentException("Unexpected token");
        }

        // 유효한 토큰일 때 리프레시 토큰으로 사용자 ID 찾음
        DeviceInfo deviceInfo = refreshTokenService.findByRefreshToken(refreshToken);
        if (deviceInfo.getPolice() != null) {
            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
//            return tokenProvider.generatePoliceToken(deviceInfo.getPolice(), Duration.ofHours(2));
            return tokenProvider.generatePoliceToken(deviceInfo.getPolice(), Duration.ofSeconds(40));
        } else if (deviceInfo.getMember() != null) {
            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
            return tokenProvider.generateMemberToken(deviceInfo.getMember(), Duration.ofHours(2));
        } else {
            throw new IllegalArgumentException("No user associated with this token");
        }
    }
}
