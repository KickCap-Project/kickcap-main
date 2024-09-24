package com.ssafy.kickcap.report.dto;

import lombok.*;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder
// Redis에 key에 대한 value 로 들어갈 Dto
public class RedisRequestDto {

    private Long violationType;

    private String image;

    private String description;

    private String kickboardNumber;

    private String lat;

    private String lng;

    private String addr;

    private String code;

    private ZonedDateTime reportTime;

}
