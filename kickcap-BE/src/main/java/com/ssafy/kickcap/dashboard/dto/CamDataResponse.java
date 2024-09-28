package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class CamDataResponse {
    private float lat;  // 위도
    private float lng;  // 경도
    private Long zero;    // 타임인덱스 별 단속 수
    private Long one;
    private Long two;
    private Long three;
    private Long four;
    private Long five;
    private Long six;
    private Long seven;
    private Long idx;     // cctv 고유 인덱스
}
