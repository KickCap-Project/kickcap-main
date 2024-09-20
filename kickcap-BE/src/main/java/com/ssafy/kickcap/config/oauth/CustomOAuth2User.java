package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.user.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private final Member member;

    @Override
    public Map<String, Object> getAttributes() {

        return Map.of(
                "name", member.getName(),
                "email", member.getEmail(),
                "memberId", member.getId() // 변경된 부분
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return member.getName();
    }


    public String getEmail() {
        return member.getEmail();
    }
}