package com.ssafy.kickcap.objection.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ObjectionUserListDto {
    private Long idx;
    private String date;
    private String title;

    @QueryProjection
    public ObjectionUserListDto(Long idx, String date, String title) {
        this.idx = idx;
        this.date = date;
        this.title = title;
    }
}
