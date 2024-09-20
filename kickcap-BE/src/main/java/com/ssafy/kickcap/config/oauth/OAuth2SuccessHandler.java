package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import com.ssafy.kickcap.user.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.time.Duration;

@RequiredArgsConstructor
@Component
// 별도의 authenticationSuccessHandler를 지정하지 않으면 로그인 성공 이후 SimpleUrlAuthenticationSuccessHandler 사용
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);
    public static final String REDIRECT_PATH = "/kickcap";

    private final TokenProvider tokenProvider;
    private final DeviceInfoRepository deviceInfoRepository;
    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Member member = memberService.findByEmail((String) oAuth2User.getAttributes().get("email"));

        // 클라이언트로부터 FCM 토큰을 받아서 처리
        String fcmToken = request.getHeader("Fcm-Token");

        // 리프레시 토큰 생성 -> 저장
        // 토큰 제공자를 사용해 리프레시 토큰 생성
        // 데이터베이스에 유저 아이디와 함께 저장
        String refreshToken = tokenProvider.generateMemberToken(member, REFRESH_TOKEN_DURATION);
        saveRefreshToken(member.getId(), refreshToken, fcmToken);

        // 액세스 토큰 생성 -> 경로에 액세스 토큰 추가
        // 토큰 제공자를 사용해 액세스 토큰을 만든 뒤 리다이렉트 경로가 담긴 값을 가져와 쿼리 파라미터에 액세스 토큰 추가
        String accessToken = tokenProvider.generateMemberToken(member, ACCESS_TOKEN_DURATION);

        // 인증 관련 설정값
        // 인증 프로세스를 진행하면서 인증 관련 데이터 제거
        clearAuthenticationAttributes(request);

        // 리다이렉트 혹은 JSON 응답으로 토큰 전달
        response.sendRedirect("/token/success?accessToken=" + accessToken + "&refreshToken=" + refreshToken);
    }

    // 생성된 리프레시 토큰을 전달받아 데이터베이스에 저장
    private void saveRefreshToken(Long userId, String newRefreshToken, String fcmToken) {
        deviceInfoRepository.findByMemberId(userId)
                .map(entity -> entity.updateRefreshToken(newRefreshToken))
                .orElseGet(() -> {
                    Member member = memberService.findById(userId);
                    return deviceInfoRepository.save(new DeviceInfo(member, fcmToken, newRefreshToken));
                });
    }

    // 액세스 토큰과 리프레시 토큰을 패스에 추가(액세스 토큰과 리프레시 토큰을 쿼리 파라미터로 반환)
    private String getTargetUrl(String accessToken, String refreshToken) {
        return UriComponentsBuilder.fromUriString(REDIRECT_PATH)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build()
                .toUriString();
    }
}
