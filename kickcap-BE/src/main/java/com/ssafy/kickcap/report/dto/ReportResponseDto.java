package com.ssafy.kickcap.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class ReportResponseDto {

    private Long idx;

    private Long memberId;

    private String violationType; // 단속 유형 이름

    private String description;

    private String reportTime;

    private String addr;

    private String imageSrc;

    private float lat;

    private float lng;

}
