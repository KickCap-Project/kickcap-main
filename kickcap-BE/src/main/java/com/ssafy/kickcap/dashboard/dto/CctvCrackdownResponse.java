package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class CctvCrackdownResponse {
    private String img;
    private Long type;
    private String date;
    private Long idx;
}
