package com.ssafy.kickcap.report.controller;

import com.ssafy.kickcap.report.dto.RealTimeReportRequestDto;
import com.ssafy.kickcap.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
// @Tag(name = "신고 컨트롤러", description = "신고 CRUD API") swagger UI 적용시 사용 예정
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/real-time")
    public ResponseEntity<Void> saveRealTimeReport(@RequestBody RealTimeReportRequestDto requestDto) {
        reportService.saveReportToRedis(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
