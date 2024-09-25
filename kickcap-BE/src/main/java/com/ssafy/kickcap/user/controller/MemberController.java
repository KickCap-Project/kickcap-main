package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.user.dto.*;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.MemberService;
import com.ssafy.kickcap.config.jwt.TokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
@Tag(name = "Member API", description = "시민 사용자 관련 API")
public class MemberController {

    private final TokenProvider tokenProvider;
    private final DeviceInfoService deviceInfoService;
    private final MemberService memberService;


    // OAuth 로그인 후 Access Token, Refresh Token, FCM 토큰 저장하는 API
    @PostMapping("/login")
    @Operation(summary = "일반 시민 로그인", description = "시민 사용자의 소셜 로그인입니다.")
    public ResponseEntity<?> oauthLogin() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/fcm")
    @Operation(summary = "토큰 전송", description = "시민 사용자의 fcm 토큰과 refresh 토큰 전송")
    public ResponseEntity<SocialLoginResponse> saveTokens(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody TokenRequest tokenRequest) {
        Member member = memberService.findById(principal.getId());
        SocialLoginResponse socialLoginResponse = deviceInfoService.saveFcmAndRefresh(member, tokenRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(socialLoginResponse);
    }

    @PutMapping("/register")
    @Operation(summary = "일반 시민 추가 정보 입력", description = "시민 사용자 휴대폰 번호와 이름을 입력받아 저장합니다.")
    public ResponseEntity<RegisterDto> registerMember(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody RegisterDto registerDto) {
        Long id = principal.getId();
        memberService.updateNameAndPhone(id, registerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerDto);
    }

    @PutMapping("")
    @Operation(summary = "개인정보 수정", description = "이름과 휴대폰번호를 수정합니다.")
    public ResponseEntity<RegisterDto> editMember(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody RegisterDto registerDto) {
        Long id = principal.getId();
        memberService.updateNameAndPhone(id, registerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerDto);
    }

    // 로그아웃 API
    @PostMapping("/logout")
    @Operation(summary = "일반 시민 로그아웃", description = "시민 사용자의 로그아웃입니다.")
    public ResponseEntity<String> logout(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody LogoutRequest logoutRequest) {

        Long id = principal.getId(); // 현재 인증된 사용자의 이메일 가져오기

        // FCM 토큰에 해당하는 리프레시 토큰 삭제
        deviceInfoService.deleteRefreshToken(id, logoutRequest);

        // 로그아웃 로직 (SecurityContext 초기화 등)
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }
}
