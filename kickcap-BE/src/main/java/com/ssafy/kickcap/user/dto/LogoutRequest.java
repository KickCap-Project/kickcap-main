package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 추가
public class LogoutRequest {
    private String fcmToken;
}
