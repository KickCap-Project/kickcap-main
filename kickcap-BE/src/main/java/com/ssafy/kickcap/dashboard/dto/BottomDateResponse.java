package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class BottomDateResponse {
    private Long tCrack;    // 오늘 단속 수
    private Long tReport;   // 오늘 신고 수
    private Long tAccident; // 오늘 사고 수
    private Long yCrack;    // 전일 단속 수
    private Long yReport;   // 전일 신고 수
    private Long yAccident; // 전일 사고 수
}
