package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

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
        OAuth2User user = super.loadUser(userRequest); // OAuth 서비스에서 제공하는 정보를 기반으로 유저 객체를 만들어줌

        // 구글에서 받아온 사용자 정보를 Member에 저장하거나 업데이트합니다.
        String email = (String) user.getAttributes().get("email");
        String name = (String) user.getAttributes().get("name");

        saveOrUpdate(user);
        return user;
    }

    // 유저가 user 테이블에 있으면 업데이트, 없으면 유저 생성
    private void saveOrUpdate(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        Member member = memberRepository.findByEmail(email)
                .map(entity -> entity.update(name))
                .orElse(Member.builder()
                        .email(email)
                        .name(name)
                        .build());
        memberRepository.save(member);
    }


}
