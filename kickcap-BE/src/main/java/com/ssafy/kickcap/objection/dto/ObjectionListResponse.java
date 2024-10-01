package com.ssafy.kickcap.objection.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

@Getter
public class ObjectionListResponse {
    private final Long idx;
    private final String date;
    private final String title;
    private final String name;

    @QueryProjection
    public ObjectionListResponse(Long idx, String date, String title, String name) {
        this.idx = idx;
        this.date = date;
        this.title = title;
        this.name = name;
    }
}
