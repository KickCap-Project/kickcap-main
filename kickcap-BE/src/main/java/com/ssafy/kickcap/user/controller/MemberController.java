package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.user.dto.LoginRequest;
import com.ssafy.kickcap.user.dto.LoginResponse;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.MemberService;
import com.ssafy.kickcap.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final TokenProvider tokenProvider;
    private final DeviceInfoService deviceInfoService;
    private final MemberService memberService;

    // OAuth 로그인 후 Access Token, Refresh Token, FCM 토큰 저장하는 API
    @PostMapping("/login")
    public ResponseEntity<?> oauthLogin() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    // 로그아웃 API
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody String fcmToken) {
        // FCM 토큰을 기반으로 리프레시 토큰 삭제
//        deviceInfoService.deleteByFcmToken(fcmToken);

        // SecurityContextHolder에서 인증 정보 제거
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logout successful");
    }
}
