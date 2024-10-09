package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
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

//    public String createNewAccessToken(String refreshToken) {
//        // access 토큰 유효성 검사에 실패하면 예외 발생 -> 401
//        if (!tokenProvider.validToken(refreshToken)){
//            throw new RestApiException(ErrorCode.UNAUTHORIZED_REQUEST);
//        }
//
//        // 유효한 토큰일 때 리프레시 토큰으로 사용자 ID 찾음
//        DeviceInfo deviceInfo = refreshTokenService.findByRefreshToken(refreshToken);
//        if (deviceInfo.getPolice() != null) {
//            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
////            return tokenProvider.generatePoliceToken(deviceInfo.getPolice(), Duration.ofHours(2));
//            return tokenProvider.generatePoliceToken(deviceInfo.getPolice(), Duration.ofSeconds(15));
//        } else if (deviceInfo.getMember() != null) {
//            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
////            return tokenProvider.generateMemberToken(deviceInfo.getMember(), Duration.ofHours(2));
//            return tokenProvider.generateMemberToken(deviceInfo.getMember(), Duration.ofSeconds(15));
//        } else {
//            throw new RestApiException(ErrorCode.NOT_FOUND); // refresh 토큰으로 찾은 사용자가 시민도 경찰도 아닐때
//        }
//    }
    public String createNewAccessToken(String refreshToken) {
        // access 토큰 유효성 검사에 실패하면 예외 발생 -> 401
        if (!tokenProvider.validToken(refreshToken)){
            throw new RestApiException(ErrorCode.FORBIDDEN_ACCESS);
        }

        // 유효한 토큰일 때 리프레시 토큰으로 사용자 ID 찾음
        DeviceInfo deviceInfo = refreshTokenService.findByRefreshToken(refreshToken);
        if (deviceInfo == null) {
            throw new RestApiException(ErrorCode.NOT_FOUND); // deviceInfo가 없을 때 예외 처리
        }

        if (deviceInfo.getPolice() != null) {
            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
            return tokenProvider.generatePoliceToken(deviceInfo.getPolice(), Duration.ofSeconds(15));
        } else if (deviceInfo.getMember() != null) {
            // 사옹자 찾은 후 토큰 제공자의 새로운 액세스 토큰 생성
            return tokenProvider.generateMemberToken(deviceInfo.getMember(), Duration.ofSeconds(15));
        } else {
            throw new RestApiException(ErrorCode.NOT_FOUND);
        }
    }

}
