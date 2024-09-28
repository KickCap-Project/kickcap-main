package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class PointDataResponse {
    private float lat;       // 위도
    private float lng;       // 경도
    private Long type;         // 포인트 타입
    private int timeIndex;    // 시간 인덱스
}
