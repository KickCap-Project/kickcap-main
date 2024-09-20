package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.user.dto.LoginRequest;
import com.ssafy.kickcap.user.dto.LoginResponse;
import com.ssafy.kickcap.user.dto.LogoutRequest;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.PoliceService;
import com.ssafy.kickcap.config.jwt.TokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/kickcap")
public class PoliceController {

    private final PoliceService policeService;
    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final DeviceInfoService deviceInfoService;

    @PostMapping("/police/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // 1. 사용자 인증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getPoliceId(), loginRequest.getPassword())
        );

        // 2. 인증 성공 시 사용자 정보 가져오기
        Police police = (Police) authentication.getPrincipal();

        // 3. 인증 정보를 SecurityContext에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 4. 리프레시 토큰 생성
        String refreshToken = tokenProvider.generatePoliceToken(police, Duration.ofDays(14));

        // 5. DeviceInfo 엔티티 저장 또는 업데이트
        deviceInfoService.saveOrUpdateDevice(police, refreshToken, loginRequest.getFcmToken());

        // 6. 액세스 토큰 생성
        String accessToken = tokenProvider.generatePoliceToken(police, Duration.ofHours(2));

        // 7. 응답 반환
        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
    }

    @PostMapping("/police/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, @RequestBody LogoutRequest logoutRequest) {
        // TODO: 접속자와 동일한 아이디인지 확인 혹은 접속한 사용자 아이디로 로그아웃하도록 하기
        // FCM 토큰에 해당하는 리프레시 토큰 삭제
        deviceInfoService.deleteByFcmToken(logoutRequest);

        // 로그아웃 로직 (SecurityContext 초기화 등)
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }
}
