//package com.ssafy.kickcap.dashboard.service;
//
//import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
//import com.ssafy.kickcap.dashboard.dto.DayTotalResponse;
//import com.ssafy.kickcap.dashboard.dto.TimeCrackdownResponse;
//import com.ssafy.kickcap.dashboard.dto.TimeIndex;
//import com.ssafy.kickcap.dashboard.dto.WeekResponse;
//import com.ssafy.kickcap.report.repository.ReportRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.time.ZonedDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@RequiredArgsConstructor
//@Service
//public class DashboardService {
//    private final CrackdownRepository crackdownRepository;
//    private final ReportRepository reportRepository;
//
//    public WeekResponse searchNationwideWeekData(int regionsId, int gugunId) {
//        ZonedDateTime endDate = ZonedDateTime.now().minusDays(1); // 어제
//        ZonedDateTime startDate = endDate.minusDays(6); // 일주일 전
//
//        List<DayTotalResponse> dayTotalResponses = getDayTotalData(endDate, startDate);
//        List<TimeCrackdownResponse> timeCrackdownResponses = getTimeCrackdown(endDate, startDate);
//
//    }
//
//    public WeekResponse searchGugunWeekData(int regionsId, int gugunId) {
//        ZonedDateTime endDate = ZonedDateTime.now().minusDays(1); // 어제
//        ZonedDateTime startDate = endDate.minusDays(6); // 일주일 전
//
//        List<DayTotalResponse> dayTotalResponses = getDayTotalData(endDate, startDate, regionsId, gugunId);
//        List<TimeCrackdownResponse> timeCrackdownResponses = getTimeCrackdown(endDate, startDate, regionsId, gugunId);
//    }
//
//    public List<DayTotalResponse> getDayTotalData(ZonedDateTime endDate, ZonedDateTime startDate) {
//
//        List<DayTotalResponse> weekData = new ArrayList<>();
//
//        List<Long> crackdownCounts = crackdownRepository.countCrackdownsByDateRange(startDate, endDate);
//        List<Long> reportCounts = reportRepository.countReportsByDateRange(startDate, endDate);
//        List<Long> accidentCounts = reportRepository.countAccidentsByDateRange(startDate, endDate);
//
//
//        for (int i = 0; i < 7; i++) {
//            DayTotalResponse response = DayTotalResponse.builder().crackDown(crackdownCounts.get(i).intValue()).report(reportCounts.get(i).intValue()).accident(accidentCounts.get(i).intValue()).date(startDate.plusDays(i).toString()).build();
//            weekData.add(response);
//        }
//
//        return weekData;
//    }
//
//    public List<TimeCrackdownResponse> getTimeCrackdown(ZonedDateTime endDate, ZonedDateTime startDate) {
//
//        List<TimeCrackdownResponse> timeCrackdownList = new ArrayList<>();
//
//        for (TimeIndex timeIndex : TimeIndex.values()) {
//            Long crackdownCount = crackdownRepository.countCrackdownsByTimeRange(
//                    startDate,
//                    endDate,
//                    Integer.parseInt(timeIndex.getStartTime().split(":")[0]),
//                    Integer.parseInt(timeIndex.getEndTime().split(":")[0])
//            );
//
//            TimeCrackdownResponse response = TimeCrackdownResponse.builder()
//                    .crackDown(crackdownCount != null ? crackdownCount.intValue() : 0)
//                    .timeIndex(timeIndex.getIndex())
//                    .build();
//
//            timeCrackdownList.add(response);
//        }
//
//        return timeCrackdownList;
//    }
//
//}
