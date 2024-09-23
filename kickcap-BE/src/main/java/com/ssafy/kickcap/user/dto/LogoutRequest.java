package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LogoutRequest {
    private String fcmToken;
}
