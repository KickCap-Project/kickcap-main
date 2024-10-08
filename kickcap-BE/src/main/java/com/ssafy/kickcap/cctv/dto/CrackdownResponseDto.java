package com.ssafy.kickcap.cctv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class CrackdownResponseDto {

    private Long idx;

    private String crackAddr;

    private String violationType;

    private String date;

    private Long cctvIdx;

    private String img;

    private String kick;

    private String name;

    private String phone;

    private int demerit;

    private String history;

}