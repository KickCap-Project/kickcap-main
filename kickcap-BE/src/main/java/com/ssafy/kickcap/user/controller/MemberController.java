package com.ssafy.kickcap.user.controller;

//import com.ssafy.kickcap.user.dto.LoginResponse;
//import com.ssafy.kickcap.user.dto.OAuthLoginRequest;
//import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.MemberService;
import com.ssafy.kickcap.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/kickcap")
public class MemberController {

    private final TokenProvider tokenProvider;
    private final DeviceInfoService deviceInfoService;
    private final MemberService memberService;

    // OAuth 로그인 후 Access Token, Refresh Token, FCM 토큰 저장하는 API
//    @PostMapping("/member/login")
//    public ResponseEntity<LoginResponse> oauthLogin(@RequestBody OAuthLoginRequest loginRequest) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = (String) authentication.getPrincipal();
//
//        // 멤버 정보 가져오기
//        Member member = memberService.findByEmail(email);
//
//        // 리프레시 토큰 생성
//        String refreshToken = tokenProvider.generateMemberToken(member, Duration.ofDays(14));
//
//        // FCM 토큰과 리프레시 토큰을 저장
//        deviceInfoService.saveDevice(member, loginRequest.getFcmToken(), refreshToken);
//
//        // 액세스 토큰 생성
//        String accessToken = tokenProvider.generateMemberToken(member, Duration.ofHours(2));
//
//        // 응답 반환 (액세스 토큰, 리프레시 토큰)
//        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
//    }
//
//    // 로그아웃 API
//    @PostMapping("/member/logout")
//    public ResponseEntity<String> logout(@RequestBody String fcmToken) {
//        // FCM 토큰을 기반으로 리프레시 토큰 삭제
//        deviceInfoService.deleteByFcmToken(fcmToken);
//
//        // SecurityContextHolder에서 인증 정보 제거
//        SecurityContextHolder.clearContext();
//
//        return ResponseEntity.ok("Logout successful");
//    }
}
