package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class SocialLoginResponse {
    private String name;
    private int demerit;
    private String phone;
}
