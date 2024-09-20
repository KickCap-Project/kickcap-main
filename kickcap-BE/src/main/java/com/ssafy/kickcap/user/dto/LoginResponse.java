package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginResponse {
    private String name;
    private String accessToken;
    private String refreshToken;
}
