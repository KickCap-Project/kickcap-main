package com.ssafy.kickcap.objection.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class ObjectionDetailResponse {

    private Long idx;              // 문의 번호
    private Long crackDownIdx;      // 단속 번호
    private String name;           // 작성자
    private Long violationType;     // 단속 종류
    private String date;           // 접수 날짜 (yyyy.MM.dd 형식)
    private String title;          // 제목
    private String content;        // 본문
    private String responseContent; // 이의제기 답변
    private String responseDate;   // 이의제기 답변 날짜

    @QueryProjection
    public ObjectionDetailResponse(Long idx, Long crackDownIdx, String name, Long violationType, String date, String title, String content, String responseContent, String responseDate) {
        this.idx = idx;
        this.crackDownIdx = crackDownIdx;
        this.name = name;
        this.violationType = violationType;
        this.date = date;
        this.title = title;
        this.content = content;
        this.responseContent = responseContent;
        this.responseDate = responseDate;
    }
}