package com.ssafy.kickcap.config.oauth;

import com.ssafy.kickcap.user.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private final Member member;

    @Override
    public Map<String, Object> getAttributes() {

        return Map.of(
                "name", member.getName(),
                "email", member.getEmail(),
                "userIdentifier", member.getId()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return user.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getName() {
        return member.getName();
    }


    public String getEmail() {
        return member.getEmail();
    }
}