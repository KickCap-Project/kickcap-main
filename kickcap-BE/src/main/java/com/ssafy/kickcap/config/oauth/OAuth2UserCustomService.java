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
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
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

        // People API를 호출하여 이름과 연락처를 가져옴
        Map<String, Object> additionalInfo = getAdditionalInfo(userRequest, oAuth2User);
        String name = (String) additionalInfo.getOrDefault("name", " ");
        String phoneNumber = (String) additionalInfo.getOrDefault("phoneNumber", " ");
        System.out.println("받음?!?!?!?!?!?!?!?!?!?!: " + name + " " + email + " " + phoneNumber);

        saveOrUpdate(email, name, phoneNumber);

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

//        if ("google".equals(registrationId)) {
//            email = (String) attributes.get("email");
//        } else
        if ("kakao".equals(registrationId)) {
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

    private Map<String, Object> getAdditionalInfo(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String accessToken = userRequest.getAccessToken().getTokenValue();

        Map<String, Object> result = new HashMap<>();

//        if ("google".equals(registrationId)) {
//            String url = "https://people.googleapis.com/v1/people/me?personFields=names,phoneNumbers";
//            HttpHeaders headers = new HttpHeaders();
//            headers.setBearerAuth(accessToken);
//            HttpEntity<String> entity = new HttpEntity<>(headers);
//
//            RestTemplate restTemplate = new RestTemplate();
//            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
//
//            List<Map<String, Object>> names = (List<Map<String, Object>>) response.getBody().get("names");
//            List<Map<String, Object>> phoneNumbers = (List<Map<String, Object>>) response.getBody().get("phoneNumbers");
//
//            if (names != null && !names.isEmpty()) {
//                result.put("name", names.get(0).get("displayName"));
//            }
//
//            if (phoneNumbers != null && !phoneNumbers.isEmpty()) {
//                result.put("phoneNumber", phoneNumbers.get(0).get("value"));
//            } else if(phoneNumbers == null || phoneNumbers.isEmpty()) {
//                System.out.println("없어 엉엉 ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ");
//            }

//        } else
        if ("kakao".equals(registrationId)) {
            // 카카오 사용자 정보 API 호출
            String url = "https://kapi.kakao.com/v2/user/me";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody().get("kakao_account");
            if (kakaoAccount != null) {
                result.put("name", kakaoAccount.get("name"));
                result.put("phoneNumber", kakaoAccount.get("phone_number")); // 전화번호 +82 10-0000-0000 형태로 받아와짐
            }
        }

        return result;
    }

    // 유저가 user 테이블에 있으면 업데이트, 없으면 유저 생성
    private void saveOrUpdate(String email, String name, String phoneNumber) {
        Member member = memberRepository.findByPhone(phoneNumber)
                .orElseGet(() -> Member.builder()
                        .email(email)
                        .name(name)
                        .phone(phoneNumber)
                        .build());

        memberRepository.save(member);
    }
}
