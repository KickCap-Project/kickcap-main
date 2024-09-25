package com.ssafy.kickcap.report.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.report.dto.ParkingReportRequestDto;
import com.ssafy.kickcap.report.dto.RedisRequestDto;
import com.ssafy.kickcap.report.service.ParkingReportService;
import com.ssafy.kickcap.report.service.RealTimeReportService;
import com.ssafy.kickcap.user.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
 @Tag(name = "신고 컨트롤러", description = "신고 관련 API")
@RequestMapping("/reports")
public class ReportController {

    private final RealTimeReportService realTimeReportService;
    private final ParkingReportService parkingReportService;

    @PostMapping("/real-time")
    @Operation(summary = "실시간 신고", description = "시민 사용자가 실시간 신고")
    public ResponseEntity<Void> saveRealTimeReport(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody RedisRequestDto requestDto) {
        realTimeReportService.saveReportToRedis(principal.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/parking")
    @Operation(summary = "불법 주차 신고", description = "시민 사용자가 불법 주차 신고")
    public ResponseEntity<Void> saveParkingReport(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody ParkingReportRequestDto requestDto) {
        parkingReportService.saveParkingReportToRedis(principal.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
