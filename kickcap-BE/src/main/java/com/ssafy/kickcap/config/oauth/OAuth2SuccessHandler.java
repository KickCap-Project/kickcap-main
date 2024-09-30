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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

@RequiredArgsConstructor
@Component
// 별도의 authenticationSuccessHandler를 지정하지 않으면 로그인 성공 이후 SimpleUrlAuthenticationSuccessHandler 사용
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);
    @Value("${redirect_uri}")
    private String REDIRECT_PATH;

    private final TokenProvider tokenProvider;
    private final DeviceInfoRepository deviceInfoRepository;
    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String phone = (String) oAuth2User.getAttributes().get("mobile");
        if (phone == null) {
            phone = (String) oAuth2User.getAttributes().get("phoneNumber");
        }
        String name = (String) oAuth2User.getAttributes().get("name");

        System.out.println("phone: "+phone);
        System.out.println("name: "+name);
        // 이메일을 사용해 Member 엔티티를 가져옴
        Member member = memberService.findByNameAndPhone(name, phone);

//        // 클라이언트로부터 FCM 토큰을 받아서 처리
//        String fcmToken = request.getHeader("Fcm-Token");

        // 리프레시 토큰 생성 -> 저장
        // 토큰 제공자를 사용해 리프레시 토큰 생성
        // 데이터베이스에 유저 아이디와 함께 저장
        String refreshToken = tokenProvider.generateMemberToken(member, REFRESH_TOKEN_DURATION);
//        addRefreshTokenToCookie(request, response, refreshToken);
////         FCM 토큰과 리프레시 토큰을 저장
//        saveDeviceInfo(member, fcmToken, refreshToken);

        // 액세스 토큰 생성 -> 경로에 액세스 토큰 추가
        // 토큰 제공자를 사용해 액세스 토큰을 만든 뒤 리다이렉트 경로가 담긴 값을 가져와 쿼리 파라미터에 액세스 토큰 추가
        String accessToken = tokenProvider.generateMemberToken(member, ACCESS_TOKEN_DURATION);
        String targetUrl = getTargetUrl(accessToken, refreshToken);

        // 인증 관련 설정값
        // 인증 프로세스를 진행하면서 인증 관련 데이터 제거
        clearAuthenticationAttributes(request);

        // 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }


    // 액세스 토큰과 리프레시 토큰을 패스에 추가(액세스 토큰과 리프레시 토큰을 쿼리 파라미터로 반환)
    private String getTargetUrl(String accessToken, String refreshToken) {
        return UriComponentsBuilder.fromUriString(REDIRECT_PATH+"/social")
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build()
                .toUriString();
    }
}
