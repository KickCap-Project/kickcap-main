package com.ssafy.kickcap.report.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.report.dto.ParkingReportRequestDto;
import com.ssafy.kickcap.report.dto.RedisRequestDto;
import com.ssafy.kickcap.report.dto.ReportListResponseDto;
import com.ssafy.kickcap.report.service.ParkingReportService;
import com.ssafy.kickcap.report.service.RealTimeReportService;
import com.ssafy.kickcap.report.service.ReportService;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.PoliceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
 @Tag(name = "신고 컨트롤러", description = "신고 관련 API")
@RequestMapping("/reports")
public class ReportController {

    private final RealTimeReportService realTimeReportService;
    private final ParkingReportService parkingReportService;
    private final ReportService reportService;
    private final PoliceService policeService;

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

    @GetMapping("/count")
    @Operation(summary = "관할 경찰서 미승인 데이터 개수 조회", description = "관할 경찰서 해당 단속 유형에 해당하는 미승인('UNAPPROVED') 데이터 개수를 반환합니다.")
    public ResponseEntity<Long> getUnApprovedReportCount(@AuthenticationPrincipal User user, @RequestParam Long violationType) {
        // user.getUsername()으로 police_id를 가져와서 경찰 찾음
        Police police = policeService.findByPoliceId(user.getUsername());
        long count = reportService.getUnApprovedReportCount(violationType, police);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/end/count")
    @Operation(summary = "관할 경찰서 승인/반려 데이터 개수 조회", description = "관할 경찰서 해당 단속 유형에 해당하는 승인/반려('APPROVED, REJECTED') 데이터 개수를 반환합니다.")
    public ResponseEntity<Long> getCompletedReportCount(@AuthenticationPrincipal User user,@RequestParam Long violationType) {
        // user.getUsername()으로 police_id를 가져와서 경찰 찾음
        Police police = policeService.findByPoliceId(user.getUsername());
        long count = reportService.getCompletedReportCount(violationType, police);
        return ResponseEntity.ok(count);
    }

    @GetMapping()
    @Operation(summary = "관할 경찰서 미승인 데이터 목록 조회", description = "관할 경찰서 해당 단속 유형에 해당하는 페이지 목록 데이터를 조회합니다.")
    public ResponseEntity<List<ReportListResponseDto>> getUnApprovedReports(@AuthenticationPrincipal User user, @RequestParam Long violationType, @RequestParam int pageNo) {
        // user.getUsername()으로 police_id를 가져와서 경찰 찾음
        Police police = policeService.findByPoliceId(user.getUsername());

        List<ReportListResponseDto> reportList = reportService.getUnApprovedReports(violationType, police, pageNo);

        return ResponseEntity.ok(reportList);
    }

    @GetMapping("/end")
    @Operation(summary = "관할 경찰서 승인/반려 데이터 목록 조회", description = "관할 경찰서 해당 단속 유형에 해당하는 페이지 목록 데이터를 조회합니다.")
    public ResponseEntity<List<ReportListResponseDto>> getCompletedReports(@AuthenticationPrincipal User user, @RequestParam Long violationType, @RequestParam int pageNo) {
        // user.getUsername()으로 police_id를 가져와서 경찰 찾음
        Police police = policeService.findByPoliceId(user.getUsername());

        List<ReportListResponseDto> reportList = reportService.getCompletedReports(violationType, police, pageNo);

        return ResponseEntity.ok(reportList); 
    }

}