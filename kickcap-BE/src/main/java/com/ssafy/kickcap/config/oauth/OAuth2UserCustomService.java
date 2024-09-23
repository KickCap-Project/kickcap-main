package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class OAuth2UserCustomService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    // 리소스 서버에서 보내주는 사용자 정보를 불러옴
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 요청을 바탕으로 유저 정보를 담은 객체 반환 <- OAuth 서비스에서 제공하는 정보를 기반으로 유저 객체를 만들어줌
        OAuth2User oAuth2User = super.loadUser(userRequest); // OAuth 서비스에서 제공하는 정보를 기반으로 유저 객체를 만들어줌
        String email = getEmailByRegistrationId(oAuth2User, userRequest);
        saveOrUpdate(email);

        // 유저 속성에 이메일을 추가
        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
        attributes.put("email", email);

        // CustomOAuth2User 클래스를 만들어서 추가된 속성을 포함한 OAuth2User 객체를 반환
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "email");
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

    // 유저가 user 테이블에 있으면 업데이트, 없으면 유저 생성
    private void saveOrUpdate(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseGet(() -> Member.builder()
                        .email(email)
                        .build());

        memberRepository.save(member);
    }
}
