package com.ssafy.kickcap.objection.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ObjectionListResponse {
    private Long idx;
    private String date;
    private String title;
    private String name;

    @QueryProjection
    public ObjectionListResponse(Long idx, String date, String title, String name) {
        this.idx = idx;
        this.date = date;
        this.title = title;
        this.name = name;
    }
}
