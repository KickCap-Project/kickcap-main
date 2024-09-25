//package com.ssafy.kickcap.dashboard.controller;
//
//import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
//import com.ssafy.kickcap.dashboard.dto.WeekResponse;
//import com.ssafy.kickcap.dashboard.service.DashboardService;
//import com.ssafy.kickcap.report.repository.ReportRepository;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/dashboard")
//@Tag(name = "Dashboard API", description = "경찰 대시보드 관련 API")
//public class DashboardController {
//
//    private final DashboardService dashboardService;
//
//    @GetMapping("")
//    @Operation(summary = "전국 1주일 통계 데이터 조회", description = "전국의 모든 카테고리의 1주일 통계 데이터를 조회")
//    public ResponseEntity<WeekResponse> NationwideWeekData() {
//        WeekResponse weekResponse = dashboardService.searchNationwideWeekData(0,0);
//        return ResponseEntity.ok().body(weekResponse);
//    }
//
//    @GetMapping("/regions")
//    @Operation(summary = "전국 1주일 통계 데이터 조회", description = "전국의 모든 카테고리의 1주일 통계 데이터를 조회")
//    public ResponseEntity<WeekResponse> gugunWeekData(@RequestParam int regionsId, @RequestParam int gugunId){
//        WeekResponse weekResponse = dashboardService.searchGugunWeekData(regionsId, gugunId);
//        return ResponseEntity.ok().body(weekResponse);
//    }
//}
