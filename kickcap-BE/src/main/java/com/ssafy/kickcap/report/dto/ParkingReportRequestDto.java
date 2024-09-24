package com.ssafy.kickcap.report.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ParkingReportRequestDto {

    private Long violationType;

    private String image;

    private String description;

    private String kickboardNumber;

    private ZonedDateTime reportTime;

}
