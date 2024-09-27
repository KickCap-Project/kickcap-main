package com.ssafy.kickcap.cctv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class CrackdownListResponseDto {

    private Long idx;

    private String addr;

    private String type;

    private String date;

}
