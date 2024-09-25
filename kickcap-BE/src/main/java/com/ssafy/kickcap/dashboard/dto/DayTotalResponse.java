package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class DayTotalResponse {
    private int crackDown;   // 총 단속 수
    private int report;      // 총 신고 수
    private int accident;    // 총 사고 수
    private String date;     // 날짜 (YY-DD)
}