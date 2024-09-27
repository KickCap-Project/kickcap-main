package com.ssafy.kickcap.bill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class BillListResponseDto {

    private Long idx;

    private String date;

    private String violationType; // 위반사항 이름

    private String deadLine;

    private int isFlag; //미납(0), 납부(1), 이의 중(2), 마감 2일전(3)

}
