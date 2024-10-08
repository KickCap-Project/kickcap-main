package com.ssafy.kickcap.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class AccidentReportResponseDto {

    private Long idx;   // 신고 idx

    private String addr;    // 신고 주소

    private String name;    // 신고자 이름

    private String phone;   // 신고자 연락처

    private String time;    // 신고 날짜 시간

    private float lat;

    private float lng;

}
