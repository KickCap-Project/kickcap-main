package com.ssafy.kickcap.report.dto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RealTimeReportRequestDto {

    private int violationType;

    private String image;

    private String description;

    private String kickboardNumber;

    private String lat; // float으로 변환 필요

    private String lng; // float으로 변환 필요

    private String addr;

    private String code; // 법정동 코드

    private ZonedDateTime reportTime;
}
