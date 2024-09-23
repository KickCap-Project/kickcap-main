package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.user.dto.LoginResponse;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import com.ssafy.kickcap.user.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

@RequiredArgsConstructor
@Component
// 별도의 authenticationSuccessHandler를 지정하지 않으면 로그인 성공 이후 SimpleUrlAuthenticationSuccessHandler 사용
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);

    private final TokenProvider tokenProvider;
    private final DeviceInfoRepository deviceInfoRepository;
    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        System.out.println("여기다!!!!!!!!!!!1 : " + email);

        // 이메일을 사용해 Member 엔티티를 가져옴
        Member member = memberService.findByEmail(email);

        // 클라이언트로부터 FCM 토큰을 받아서 처리
        String fcmToken = request.getHeader("Fcm-Token");

        // 리프레시 토큰 생성 -> 저장
        // 토큰 제공자를 사용해 리프레시 토큰 생성
        // 데이터베이스에 유저 아이디와 함께 저장
        String refreshToken = tokenProvider.generateMemberToken(member, REFRESH_TOKEN_DURATION);

        // FCM 토큰과 리프레시 토큰을 저장
        saveDeviceInfo(member, fcmToken, refreshToken);

        // 액세스 토큰 생성 -> 경로에 액세스 토큰 추가
        // 토큰 제공자를 사용해 액세스 토큰을 만든 뒤 리다이렉트 경로가 담긴 값을 가져와 쿼리 파라미터에 액세스 토큰 추가
        String accessToken = tokenProvider.generateMemberToken(member, ACCESS_TOKEN_DURATION);

        // 인증 관련 설정값
        // 인증 프로세스를 진행하면서 인증 관련 데이터 제거
        clearAuthenticationAttributes(request);

        // 응답을 JSON 형식으로 직접 작성
        String responseBody = String.format("{\"name\":\"%s\",\"accessToken\":\"%s\",\"refreshToken\":\"%s\"}",
                member.getName(), accessToken, refreshToken);

        // 응답 헤더 및 본문 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(responseBody);
    }


    // DeviceInfo 저장 메서드
    private void saveDeviceInfo(Member member, String fcmToken, String refreshToken) {
        // DeviceInfoRepository를 사용해 기존 FCM 토큰이 있는지 확인 후 저장 또는 업데이트
        deviceInfoRepository.findByMemberIdAndFcmToken(member.getId(), fcmToken)
                .map(entity -> entity.updateRefreshToken(refreshToken)) // 이미 존재하는 FCM 토큰이면 리프레시 토큰만 업데이트
                .orElseGet(() -> deviceInfoRepository.save(new DeviceInfo(member, fcmToken, refreshToken))); // 없으면 새로 저장
    }

    private String getEmailByRegistrationId(OAuth2User oAuth2User, OAuth2UserRequest userRequest) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String email;

        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakaoAccount.get("email");
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            email = (String) response.get("email");
        } else {
            email = null;
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }
        return email;
    }

//    // 액세스 토큰과 리프레시 토큰을 패스에 추가(액세스 토큰과 리프레시 토큰을 쿼리 파라미터로 반환)
//    private String getTargetUrl(String accessToken, String refreshToken) {
//        return UriComponentsBuilder.fromUriString(REDIRECT_PATH)
//                .queryParam("accessToken", accessToken)
//                .queryParam("refreshToken", refreshToken)
//                .build()
//                .toUriString();
//    }
}
