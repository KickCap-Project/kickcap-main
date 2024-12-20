package com.ssafy.kickcap.report.dto;

import com.ssafy.kickcap.report.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class ReportListResponseDto {

    private Long idx;
    private String addr;
    private String createTime;

    public static ReportListResponseDto fromEntity(Report report) {
        return ReportListResponseDto.builder()
                .idx(report.getId())
                .addr(report.getAddress())
                .createTime(report.getCreatedAt().toString())
                .build();
    }
}
