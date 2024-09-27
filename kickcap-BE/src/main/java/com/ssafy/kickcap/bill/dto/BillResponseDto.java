package com.ssafy.kickcap.bill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class BillResponseDto {

    private Long idx;

    private String kickboardNumber;

    private String date;    // 위반 일시

    private String address;   // 위반 장소

    private String violationType; // 위반 유형 이름

    private int demerit;    // 벌점

    private int fine;      // 범칙금

    private int totalBill;

    private String deadLine; // 납부 기한

    private String police;  // 경찰서 이름

    private String isFlag;  // 납부 상태

    private int isObjection; // 이의 여부

}
