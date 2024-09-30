package com.ssafy.kickcap.bill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class BillObjectionDto {
    private String title;
    private String content;
}
