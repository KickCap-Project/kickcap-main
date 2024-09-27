package com.ssafy.kickcap.dashboard.service;

import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.cctv.repository.CrackdownRepositoryImpl;
import com.ssafy.kickcap.dashboard.dto.*;
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

    // 일주일간 데이터를 조회합니다.
    public WeekResponse searchWeekData(String sido, String gugun) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, gugun); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        System.out.println(stationIdxList);
        return getWeekDataByRegion(stationIdxList);
    }

    private WeekResponse getWeekDataByRegion(List<Long> stationIdxList) {
        List<DayTotalResponse> dayTotalResponses = getDayTotalData(stationIdxList);
        List<TimeCrackdownResponse> timeCrackdownResponses = getTimeCrackdown(stationIdxList);

        Long noHead = getCrackdownCountByViolationType(stationIdxList, 3L);
        Long peoples = getCrackdownCountByViolationType(stationIdxList, 1L);
        Long p = getReportCountByViolationType(stationIdxList,4L);
        Long n = getReportCountByViolationType(stationIdxList,3L);
        Long h = getReportCountByViolationType(stationIdxList,1L);
        Long d = getReportCountByViolationType(stationIdxList,2L);
        Long w = getReportCountByViolationType(stationIdxList,5L);

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

    public Long getCrackdownCountByViolationType(List<Long> stationIdxList, Long n) {
        return crackdownRepositoryImpl.getCrackdownCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,n);
    }

    public Long getReportCountByViolationType(List<Long> stationIdxList, Long n) {
        return reportRepositoryImpl.getReportCountByViolationType(stationIdxList, startOfLastWeek, startOfToday,n);
    }


    /////////////////////////////////// 하단 데이터 ////////////////////////////////
    public BottomDateResponse searchBottomData(String sido, String gugun) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, gugun); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        return getBottomDataByRegion(stationIdxList);
    }

    private BottomDateResponse getBottomDataByRegion(List<Long> stationIdxList) {
        ZonedDateTime startDay = now.minusDays(1).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
        ZonedDateTime endDay = now.toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

        Long tCrack = getCrackdownCountOfDay(stationIdxList,startDay,endDay);    // 오늘 단속 수
        Long tReport = getReportCountOfDay(stationIdxList,startDay,endDay);   // 오늘 신고 수
        Long tAccident = getAccidentCountOfDay(stationIdxList,startDay,endDay); // 오늘 사고 수

        startDay = now.minusDays(2).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
        endDay = now.minusDays(1).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

        Long yCrack = getCrackdownCountOfDay(stationIdxList,startDay,endDay);    // 전일 단속 수
        Long yReport = getReportCountOfDay(stationIdxList,startDay,endDay);   // 전일 신고 수
        Long yAccident = getAccidentCountOfDay(stationIdxList,startDay,endDay); // 전일 사고 수

        return BottomDateResponse.builder()
                .tCrack(tCrack)
                .tReport(tReport)
                .tAccident(tAccident)
                .yCrack(yCrack)
                .yReport(yReport)
                .yAccident(yAccident)
                .build();
    }

    public Long getCrackdownCountOfDay(List<Long> stationIdxList, ZonedDateTime startDay, ZonedDateTime endDay) {
        return crackdownRepositoryImpl.getCrackdownCountOfDay(stationIdxList, startDay, endDay);
    }

    public Long getReportCountOfDay(List<Long> stationIdxList, ZonedDateTime startDay, ZonedDateTime endDay) {
        return reportRepositoryImpl.getReportCountOfDay(stationIdxList, startDay, endDay);
    }

    public Long getAccidentCountOfDay(List<Long> stationIdxList, ZonedDateTime startDay, ZonedDateTime endDay) {
        return accidentReportRepositoryImpl.getAccidentCountOfDay(stationIdxList, startDay, endDay);
    }


}
