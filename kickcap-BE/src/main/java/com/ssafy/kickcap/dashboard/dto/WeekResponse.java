package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
@AllArgsConstructor
@Getter
@Builder
public class WeekResponse {

    private List<DayTotalResponse> dayTotalResponses;
    private List<TimeCrackdownResponse> timeCrackdownResponses;
    private Long noHead;       // 총 미 착용 건
    private Long peoples;      // 총 다인 건
    private Long p;            // 총 불법 주차 건
    private Long n;            // 총 미 착용 건
    private Long h;            // 총 다인 승차 건
    private Long d;            // 총 보도주행 건
    private Long w;            // 총 지정차로 건
}
