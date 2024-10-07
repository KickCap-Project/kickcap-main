package com.ssafy.kickcap.report.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.report.dto.*;
import com.ssafy.kickcap.report.service.AccidentReportService;
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
    private final AccidentReportService accidentReportService;
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

    @PostMapping("/accident")
    @Operation(summary = "사고 신고", description = "시민 사용자가 사고 신고")
    public ResponseEntity<Void> saveAccidentReport(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody AccidentReportRequestDto requestDto) {
        accidentReportService.saveAccidentReport(principal.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/accident")
    @Operation(summary = "사고 신고 접수 가져오기")
    public ResponseEntity<AccidentReportResponseDto> getAccidentReport(@AuthenticationPrincipal User user) {
        Police police = policeService.findByPoliceId(user.getUsername());
        AccidentReportResponseDto responseDto = accidentReportService.getAccidentReport(police);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/accident/{idx}")
    @Operation(summary = "사고 출동 처리")
    public ResponseEntity<Void> udpateIsRead(@AuthenticationPrincipal User user, @PathVariable Long idx) {
        Police police = policeService.findByPoliceId(user.getUsername());
        accidentReportService.updateIsRead(police, idx);
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

    @GetMapping("/{reportId}")
    @Operation(summary = "신고 상세 조회")
    public ResponseEntity<ReportResponseDto> getReport(@AuthenticationPrincipal User user, @PathVariable Long reportId) {
        Police police = policeService.findByPoliceId(user.getUsername());
        ReportResponseDto responseDto = reportService.getReport(police, reportId);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/{reportId}/approve")
    @Operation(summary = "신고 승인", description = "해당 신고를 경찰이 승인합니다. 자동으로 고지서가 발부됩니다.")
    public ResponseEntity<Void> approveReport(@AuthenticationPrincipal User user, @PathVariable Long reportId) {
        Police police = policeService.findByPoliceId(user.getUsername());

        reportService.approveReport(police, reportId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{reportId}/reject")
    @Operation(summary = "신고 반려", description = "해당 신고를 경찰이 반려합니다.")
    public ResponseEntity<Void> rejectReport(@AuthenticationPrincipal User user, @PathVariable Long reportId) {
        Police police = policeService.findByPoliceId(user.getUsername());
        reportService.rejectReport(police, reportId);
        return ResponseEntity.ok().build();
    }

}
