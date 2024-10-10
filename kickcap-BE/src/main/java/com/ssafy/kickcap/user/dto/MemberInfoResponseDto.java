package com.ssafy.kickcap.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class MemberInfoResponseDto {

    private String kick;    // 해당 신고건의 킥보드 번호 -> reportId

    private String name;    // 사용자 이름

    private String phone;   // 사용자 전화번호

    private int demerit;    // 사용자 벌점

    private String history; // 최근 단속 내역 "2024. 09. 02 / 헬맷 미착용"

}
