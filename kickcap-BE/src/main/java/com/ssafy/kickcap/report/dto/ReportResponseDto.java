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

    private String createTime;

    private String addr;

    private String imageSrc;

    private float lat;

    private float lng;

    private int isEnd;  // 0 = 미완료, 1 = 완료

}
