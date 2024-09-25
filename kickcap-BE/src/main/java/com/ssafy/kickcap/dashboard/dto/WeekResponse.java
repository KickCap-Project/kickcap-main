package com.ssafy.kickcap.dashboard.dto;

import java.util.List;

public class WeekResponse {

    private List<DayToalResponse> chart1;
    private List<TimeCrackdownResponse> chart2;
    private int noHead;       // 총 미 착용 건
    private int peoples;      // 총 다인 건
    private int p;            // 총 불법 주차 건
    private int n;            // 총 미 착용 건
    private int h;            // 총 다인 승차 건
    private int d;            // 총 보도주행 건
    private int w;            // 총 지정차로 건
}
