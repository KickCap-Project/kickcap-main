package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class OAuth2UserCustomService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2User oAuth2User;

        switch (registrationId) {
            case "naver":
                oAuth2User = loadNaverUser(userRequest);
                break;
            case "kakao":
                oAuth2User = loadKakaoUser(userRequest);
                break;
            default:
                oAuth2User = super.loadUser(userRequest);
        }

        return oAuth2User;
    }

    private OAuth2User loadNaverUser(OAuth2UserRequest userRequest) {
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String userInfoEndpointUri = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(userInfoEndpointUri, HttpMethod.GET, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !responseBody.containsKey("response")) {
            throw new OAuth2AuthenticationException("Failed to retrieve user information from Naver.");
        }

        Map<String, Object> attributes = (Map<String, Object>) responseBody.get("response");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String phoneNumber = (String) attributes.get("mobile");

        saveOrUpdate(email, name, phoneNumber);

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("MEMBER")), attributes, "mobile");
    }

    private OAuth2User loadKakaoUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> additionalInfo = getAdditionalInfo(userRequest, oAuth2User);
        String email = (String) additionalInfo.get("email");
        String name = (String) additionalInfo.getOrDefault("name", "");
        String phoneNumber = (String) additionalInfo.getOrDefault("phoneNumber", "");

        saveOrUpdate(email, name, phoneNumber);

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("MEMBER")), additionalInfo, "phoneNumber");
    }

    private Map<String, Object> getAdditionalInfo(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String accessToken = userRequest.getAccessToken().getTokenValue();
        Map<String, Object> result = new HashMap<>();

        if ("kakao".equals(registrationId)) {
            String url = "https://kapi.kakao.com/v2/user/me";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody().get("kakao_account");
            if (kakaoAccount != null) {
                result.put("email", kakaoAccount.get("email"));
                result.put("name", kakaoAccount.get("name"));
                // '+82'로 시작하는 경우를 '010'으로 변경
                String phoneNumber = ((String)kakaoAccount.get("phone_number")).replace("+82 ", "0");
                result.put("phoneNumber", phoneNumber);
            }
        }

        return result;
    }

    private void saveOrUpdate(String email, String name, String phoneNumber) {
        Member member = memberRepository.findByPhone(phoneNumber)
                .orElseGet(() -> Member.builder()
                        .email(email)
                        .name(name)
                        .phone(phoneNumber)
                        .build());

        memberRepository.save(member);
        System.out.println(member.toString());
        System.out.println("저장완료");
    }
}
