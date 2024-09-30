package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.user.dto.LoginRequest;
import com.ssafy.kickcap.user.dto.LoginResponse;
import com.ssafy.kickcap.user.dto.LogoutRequest;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.DeviceInfoService;
import com.ssafy.kickcap.user.service.PoliceService;
import com.ssafy.kickcap.config.jwt.TokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@RequestMapping("/police")
@Tag(name = "Police API", description = "경찰 사용자 관련 API")
public class PoliceController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final DeviceInfoService deviceInfoService;
    private final PoliceService policeService;


    @PostMapping("/login")
    @Operation(summary = "경찰 로그인", description = "경찰 사용자의 소셜 로그인입니다.")
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
//        String refreshToken = tokenProvider.generatePoliceToken(police, Duration.ofDays(14));
        String refreshToken = tokenProvider.generatePoliceToken(police, Duration.ofSeconds(40));

        // 5. DeviceInfo 엔티티 저장 또는 업데이트
        deviceInfoService.saveOrUpdateDevice(police, refreshToken, loginRequest.getFcmToken());

        // 6. 액세스 토큰 생성
//        String accessToken = tokenProvider.generatePoliceToken(police, Duration.ofHours(2));
        String accessToken = tokenProvider.generatePoliceToken(police, Duration.ofSeconds(20));

        // 7. 응답 반환
        return ResponseEntity.ok(new LoginResponse(police.getName(), accessToken, refreshToken));
    }

    @PostMapping("/logout")
    @Operation(summary = "경찰 로그아웃", description = "경찰 사용자의 로그아웃입니다.")
    public ResponseEntity<String> logout(@AuthenticationPrincipal User user, @RequestBody LogoutRequest logoutRequest) {
        // 서비스에서 경찰 객체를 가져오는 메서드 필요
        Police police = policeService.findByPoliceId(user.getUsername());
        // user.getUsername()으로 police_id를 가져와서 경찰 찾음

        if (police == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }

        System.out.println("Police ID: " + police.getId());

        // FCM 토큰에 해당하는 리프레시 토큰 삭제
        deviceInfoService.deleteRefreshToken(police.getId(), logoutRequest);

        // 로그아웃 로직 (SecurityContext 초기화 등)
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }
}
