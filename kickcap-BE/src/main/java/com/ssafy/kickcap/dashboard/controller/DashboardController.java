package com.ssafy.kickcap.dashboard.controller;

import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.dashboard.dto.BottomDateResponse;
import com.ssafy.kickcap.dashboard.dto.CctvInfoReponse;
import com.ssafy.kickcap.dashboard.dto.MarkersDataReponse;
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

//    @GetMapping("")
//    @Operation(summary = "전국 1주일 통계 데이터 조회", description = "전국의 일주일간 데이터를 조회합니다.")
//    public ResponseEntity<WeekResponse> NationwideWeekData() {
//        WeekResponse weekResponse = dashboardService.searchWeekData("","");
//        return ResponseEntity.ok().body(weekResponse);
//    }

    @GetMapping("")
    @Operation(summary = "시도 및 구군 1주일 통계 데이터 조회", description = "특정 시도의 또는 특정 구군의 일주일간 데이터를 조회합니다.")
    public ResponseEntity<WeekResponse> weekData(
            @RequestParam(required = false) String sido,
            @RequestParam(required = false) String gugun) {

        WeekResponse weekResponse;

        if (sido == null || sido.isEmpty()) {
            // 시도가 제공되지 않았을 때 전국으로 조회
            weekResponse = dashboardService.searchWeekData("","");
        } else if (gugun == null || gugun.isEmpty()) {
            // 구군이 제공되지 않았을 때, 시도만으로 조회
            weekResponse = dashboardService.searchWeekData(sido,"");
        } else {
            // 구군이 제공되었을 때, 시도와 구군으로 조회
            weekResponse = dashboardService.searchWeekData(sido, gugun);
        }

        return ResponseEntity.ok().body(weekResponse);
    }

    @GetMapping("/bottoms")
    @Operation(summary = "전국 또는 시도 및 구군 하단 통계 데이터 조회", description = "전국이나 특정 시도의 또는 특정 구군의 하단 데이터를 조회합니다.")
    public ResponseEntity<BottomDateResponse> bottomData(
            @RequestParam(required = false) String sido,
            @RequestParam(required = false) String gugun) {

        BottomDateResponse bottomDateResponse;

        if (sido == null || sido.isEmpty()) {
            // 시도가 제공되지 않았을 때 전국으로 조회
            bottomDateResponse = dashboardService.searchBottomData("","");
        } else if (gugun == null || gugun.isEmpty()) {
            // 구군이 제공되지 않았을 때, 시도만으로 조회
            bottomDateResponse = dashboardService.searchBottomData(sido,"");
        } else {
            // 구군이 제공되었을 때, 시도와 구군으로 조회
            bottomDateResponse = dashboardService.searchBottomData(sido, gugun);
        }

        return ResponseEntity.ok().body(bottomDateResponse);
    }

    @GetMapping("/markers")
    @Operation(summary = "구군 마커 데이터 조회", description = "특정 시도의 특정 구군의 cctv와 신고 데이터를 조회합니다.")
    public ResponseEntity<MarkersDataReponse> getMarkersData(@RequestParam String sido,
                                                             @RequestParam String gugun){

        MarkersDataReponse markersDataReponse = dashboardService.searchGugunMarkerDate(sido, gugun);
        return ResponseEntity.ok().body(markersDataReponse);
    }

    @GetMapping("/cctv")
    @Operation(summary = "cctv 상세정보 조회", description = "특정 cctv의 특정 시간대의 단속 정보를 조회할 수 있습니다.")
    public ResponseEntity<CctvInfoReponse> getCctvData(@RequestParam Long idx,
                                                             @RequestParam int time){

        CctvInfoReponse cctvInfoReponse = dashboardService.searchCctvInfoByTime(idx, time);
        return ResponseEntity.ok().body(cctvInfoReponse);
    }
}
