package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class TimeCrackdownResponse {
    private int crackDown;   // 총 단속 수
    private int timeIndex;   // 시간 인덱스
}