package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.user.dto.*;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
@Tag(name = "Member API", description = "시민 사용자 관련 API")
public class MemberController {

    private final TokenProvider tokenProvider;
    private final DeviceInfoService deviceInfoService;
    private final MemberService memberService;

    @PostMapping("/fcm")
    @Operation(summary = "토큰 전송", description = "시민 사용자의 fcm 토큰과 refresh 토큰 전송")
    public ResponseEntity<SocialLoginResponse> saveTokens(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody TokenRequest tokenRequest) {
        Member member = memberService.findById(principal.getId());
        SocialLoginResponse socialLoginResponse = deviceInfoService.saveFcmAndRefresh(member, tokenRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(socialLoginResponse);
    }

    @GetMapping("/demerit")
    @Operation(summary = "벌점 조회", description = "시민 사용자의 벌점 내역 조회")
    public ResponseEntity<Integer> getDemerit(@AuthenticationPrincipal CustomOAuth2User principal) {
        System.out.println("여기!!!!!! "+principal.getId());
        Member member = memberService.findById(principal.getId());
        System.out.println(member.getDemerit());
        return ResponseEntity.ok(member.getDemerit());
    }

    // 로그아웃 API
    @PostMapping("/logout")
    @Operation(summary = "일반 시민 로그아웃", description = "시민 사용자의 로그아웃입니다.")
    public ResponseEntity<String> logout(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody LogoutRequest logoutRequest) {

        Long id = principal.getId(); // 현재 인증된 사용자의 이메일 가져오기
        Member member = memberService.findById(id);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }

        // FCM 토큰에 해당하는 리프레시 토큰 삭제
        deviceInfoService.deleteRefreshToken(id, logoutRequest);

        // 로그아웃 로직 (SecurityContext 초기화 등)
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/{memberId}/info")
    @Operation(summary = "단속자 정보 조회", description = "신고페이지에서 단속자 정보를 조회합니다.")
    public ResponseEntity<MemberInfoResponseDto> getMemberInfo(@PathVariable Long memberId, @RequestParam Long reportId) {
        MemberInfoResponseDto memberInfo = memberService.getMemberInfo(memberId, reportId);
        return ResponseEntity.ok(memberInfo);
    }
}
