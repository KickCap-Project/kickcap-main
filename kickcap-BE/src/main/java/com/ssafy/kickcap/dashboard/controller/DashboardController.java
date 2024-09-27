package com.ssafy.kickcap.dashboard.controller;

import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.dashboard.dto.WeekResponse;
import com.ssafy.kickcap.dashboard.service.DashboardService;
import com.ssafy.kickcap.report.repository.ReportRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard API", description = "경찰 대시보드 관련 API")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("")
    @Operation(summary = "전국 1주일 통계 데이터 조회", description = "전국의 일주일간 데이터를 조회합니다.")
    public ResponseEntity<WeekResponse> NationwideWeekData() {
        WeekResponse weekResponse = dashboardService.searchNationwideWeekData();
        return ResponseEntity.ok().body(weekResponse);
    }

    @GetMapping("/regions")
    @Operation(summary = "시도 및 구군 1주일 통계 데이터 조회", description = "특정 시도의 또는 특정 구군의 일주일간 데이터를 조회합니다.")
    public ResponseEntity<WeekResponse> gugunWeekData(
            @RequestParam String sido,
            @RequestParam(required = false) String gugun) {

        WeekResponse weekResponse;

        if (gugun == null || gugun.isEmpty()) {
            // 구군이 제공되지 않았을 때, 시도만으로 조회
            weekResponse = dashboardService.searchSidoWeekData(sido);
        } else {
            // 구군이 제공되었을 때, 시도와 구군으로 조회
            weekResponse = dashboardService.searchGugunWeekData(sido, gugun);
        }

        return ResponseEntity.ok().body(weekResponse);
    }

}
