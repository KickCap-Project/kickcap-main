package com.ssafy.kickcap.dashboard.service;

import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.cctv.repository.CrackdownRepositoryImpl;
import com.ssafy.kickcap.dashboard.dto.DayTotalResponse;
import com.ssafy.kickcap.dashboard.dto.TimeCrackdownResponse;
import com.ssafy.kickcap.dashboard.dto.TimeIndex;
import com.ssafy.kickcap.dashboard.dto.WeekResponse;
import com.ssafy.kickcap.region.repository.RegionCodeRepositoryImpl;
import com.ssafy.kickcap.report.repository.AccidentReportRepositoryImpl;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.report.repository.ReportRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DashboardService {

    private final RegionCodeRepositoryImpl regionCodeRepositoryImpl;
    private final CrackdownRepositoryImpl crackdownRepositoryImpl;
    private final ReportRepositoryImpl reportRepositoryImpl;
    private final AccidentReportRepositoryImpl accidentReportRepositoryImpl;

    // 현재 시간을 Asia/Seoul 타임존으로 가져오기
    ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

    // 현재 시간의 자정과 7일 전 자정 계산
    ZonedDateTime startOfLastWeek = now.minusDays(7).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
    ZonedDateTime startOfToday = now.toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

    // 전국의 일주일간 데이터를 조회합니다.
    public WeekResponse searchNationwideWeekData() {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion("", ""); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        return getWeekDataByRegion(stationIdxList);
    }

    // 특정 시도의 일주일간 데이터를 조회합니다.
    public WeekResponse searchSidoWeekData(String sido) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, ""); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        return getWeekDataByRegion(stationIdxList);
    }

    // 특정 시도의 특정 구군의 일주일간 데이터를 조회합니다.
    public WeekResponse searchGugunWeekData(String sido, String gugun) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, gugun); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        return getWeekDataByRegion(stationIdxList);
    }

    private WeekResponse getWeekDataByRegion(List<Long> stationIdxList) {
        List<DayTotalResponse> dayTotalResponses = getDayTotalData(stationIdxList);
        List<TimeCrackdownResponse> timeCrackdownResponses = getTimeCrackdown(stationIdxList);

        Long noHead = getNoHelmetCrackdownCount(stationIdxList);
        Long peoples = getRideTogetherCrackdownCount(stationIdxList);
        Long p = getIllegalParkingReportCount(stationIdxList);
        Long n = getNoHelmetReportCount(stationIdxList);
        Long h = getRideTogetherReportCount(stationIdxList);
        Long d = getSidewalkDrivingReportCount(stationIdxList);
        Long w = getDesignatedLaneReportCount(stationIdxList);

        return WeekResponse.builder()
                .dayTotalResponses(dayTotalResponses)
                .timeCrackdownResponses(timeCrackdownResponses)
                .noHead(noHead)
                .peoples(peoples)
                .p(p)
                .n(n)
                .h(h)
                .d(d)
                .w(w)
                .build();
    }

    // 주어진 시도와 구군에 해당하는 단속, 신고, 사고 데이터를 날짜별로 집계하여 반환합니다.
    public List<DayTotalResponse> getDayTotalData(List<Long> stationIdxList) {

        List<DayTotalResponse> weekData = new ArrayList<>();

        List<Long> crackdownCounts = crackdownRepositoryImpl.countCrackdownsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday); // 날짜별 단속 건수 조회
        List<Long> reportCounts = reportRepositoryImpl.countReportsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday); // 날짜별 신고 건수 조회
        List<Long> accidentCounts = accidentReportRepositoryImpl.countAccidentsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday); // 날짜별 사고 건수 조회

        System.out.println("crackdownCounts : " + crackdownCounts);
        System.out.println("reportCounts : " + reportCounts);
        System.out.println("accidentCounts : " + accidentCounts);

        for (int i = 0; i < 7; i++) {
            DayTotalResponse response = DayTotalResponse.builder()
                    .crackDown(crackdownCounts.get(i).intValue()) // 단속 건수 설정
                    .report(reportCounts.get(i).intValue()) // 신고 건수 설정
                    .accident(accidentCounts.get(i).intValue()) // 사고 건수 설정
                    .date(startOfLastWeek.plusDays(i).toString()) // 날짜 설정
                    .build();
            weekData.add(response); // 리스트에 추가
        }

        return weekData; // 결과 리스트 반환
    }

    // 주어진 시도와 구군에 해당하는 단속 데이터를 시간대별로 집계하여 반환합니다.
    public List<TimeCrackdownResponse> getTimeCrackdown(List<Long> stationIdxList) {

        List<TimeCrackdownResponse> timeCrackdownList = new ArrayList<>();

        for (TimeIndex timeIndex : TimeIndex.values()) {
            Long crackdownCount = crackdownRepositoryImpl.countCrackdownsByTimeRangeAndRegion(
                    stationIdxList,
                    startOfLastWeek,
                    startOfToday,
                    Integer.parseInt(timeIndex.getStartTime().split(":")[0]), // 시작 시간 추출
                    Integer.parseInt(timeIndex.getEndTime().split(":")[0]) // 종료 시간 추출
            );

            TimeCrackdownResponse response = TimeCrackdownResponse.builder()
                    .crackDown(crackdownCount != null ? crackdownCount.intValue() : 0) // 단속 건수 설정
                    .timeIndex(timeIndex.getIndex()) // 시간대 인덱스 설정
                    .build();

            timeCrackdownList.add(response); // 리스트에 추가
        }

        return timeCrackdownList; // 결과 리스트 반환
    }

    public Long getNoHelmetCrackdownCount(List<Long> stationIdxList) {
        return crackdownRepositoryImpl.getCrackdownCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,3L);
    }

    public Long getRideTogetherCrackdownCount(List<Long> stationIdxList) {
        return crackdownRepositoryImpl.getCrackdownCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,1L);
    }

    public Long getIllegalParkingReportCount(List<Long> stationIdxList) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,4L);
    }

    public Long getNoHelmetReportCount(List<Long> stationIdxList) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,3L);
    }

    public Long getRideTogetherReportCount(List<Long> stationIdxList) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,1L);
    }

    public Long getSidewalkDrivingReportCount(List<Long> stationIdxList) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,2L);
    }

    public Long getDesignatedLaneReportCount(List<Long> stationIdxList) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,5L);
    }
}
