package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginRequest {
    private String policeId;
    private String password;
    private String fcmToken;
}
