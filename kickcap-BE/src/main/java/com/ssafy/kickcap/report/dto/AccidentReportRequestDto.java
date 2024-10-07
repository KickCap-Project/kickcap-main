package com.ssafy.kickcap.report.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccidentReportRequestDto {

    private String addr;

    private float lat;

    private float lng;

    private String code;

}
