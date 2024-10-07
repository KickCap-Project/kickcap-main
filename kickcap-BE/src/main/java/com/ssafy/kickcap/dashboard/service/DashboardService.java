package com.ssafy.kickcap.dashboard.service;

import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.repository.CctvInfoRepository;
import com.ssafy.kickcap.cctv.repository.CrackdownRepositoryImpl;
import com.ssafy.kickcap.dashboard.dto.*;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.region.repository.RegionCodeRepositoryImpl;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.AccidentReportRepositoryImpl;
import com.ssafy.kickcap.report.repository.ReportRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class DashboardService {

    private final RegionCodeRepositoryImpl regionCodeRepositoryImpl;
    private final CrackdownRepositoryImpl crackdownRepositoryImpl;
    private final ReportRepositoryImpl reportRepositoryImpl;
    private final AccidentReportRepositoryImpl accidentReportRepositoryImpl;
    private final CctvInfoRepository cctvInfoRepository;

    // 현재 시간을 Asia/Seoul 타임존으로 가져오기
    ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

    // 현재 시간의 자정과 7일 전 자정 계산
    ZonedDateTime startOfLastWeek = now.minusDays(7).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
    ZonedDateTime startOfToday = now.toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

    // 일주일간 데이터를 조회합니다.
    public WeekResponse searchWeekData(String sido, String gugun) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, gugun); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
//        System.out.println(stationIdxList);
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

        // 수정된 쿼리 메서드 호출
        Map<LocalDate, Long> crackdownMap = crackdownRepositoryImpl.countCrackdownsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday);
        Map<LocalDate, Long> reportMap = reportRepositoryImpl.countReportsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday);
        Map<LocalDate, Long> accidentMap = accidentReportRepositoryImpl.countAccidentsByDateRangeAndRegion(stationIdxList, startOfLastWeek, startOfToday);

        // 지난 일주일 동안의 날짜 리스트 생성
        List<LocalDate> dateList = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = startOfLastWeek.toLocalDate().plusDays(i);
            dateList.add(date);
        }

        // 날짜별로 카운트를 설정하고, 없는 경우 0으로 채움
        for (LocalDate date : dateList) {
            DayTotalResponse response = DayTotalResponse.builder()
                    .crackDown(crackdownMap.getOrDefault(date, 0L).intValue())
                    .report(reportMap.getOrDefault(date, 0L).intValue())
                    .accident(accidentMap.getOrDefault(date, 0L).intValue())
                    .date(date.toString())
                    .build();
            weekData.add(response);
        }

        return weekData;
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
        ZonedDateTime startDay = now.toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
        ZonedDateTime endDay = now.plusDays(1).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

        Long tCrack = getCrackdownCountOfDay(stationIdxList,startDay,endDay);    // 오늘 단속 수
        Long tReport = getReportCountOfDay(stationIdxList,startDay,endDay);   // 오늘 신고 수
        Long tAccident = getAccidentCountOfDay(stationIdxList,startDay,endDay); // 오늘 사고 수

        startDay = now.minusDays(1).toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));
        endDay = now.toLocalDate().atStartOfDay(ZoneId.of("Asia/Seoul"));

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


    ///////////////////////////////////////구군 마커 데이터 조회////////////////////////////////////////////
    public MarkersDataReponse searchGugunMarkerDate(String sido, String gugun) {
        List<Long> stationIdxList = regionCodeRepositoryImpl.findStationIdxByRegion(sido, gugun); // 해당 시도와 구군에 해당하는 stationIdx 목록 조회
        return getMarkerDataByRegion(stationIdxList);
    }

    private MarkersDataReponse getMarkerDataByRegion(List<Long> stationIdxList) {
        List<CamDataResponse> camDataResponses = getCamData(stationIdxList);
        List<PointDataResponse> pointDataResponses = getPointData(stationIdxList);
        
        return MarkersDataReponse.builder()
                .camDataResponses(camDataResponses)
                .pointDataResponses(pointDataResponses)
                .build();
    }

    private List<CamDataResponse> getCamData(List<Long> stationIdxList) {
        List<CCTVInfo> cctvInfos = crackdownRepositoryImpl.findCCTVsByStationIdx(stationIdxList);
        List<CamDataResponse> camDataResponses = new ArrayList<>();

        for (CCTVInfo cctvInfo : cctvInfos) {
            Long[] crackdownCounts = crackdownRepositoryImpl.countCrackdownsByCCTVAndTimeRange(cctvInfo.getId(), startOfLastWeek, startOfToday);

            CamDataResponse response = CamDataResponse.builder()
                    .lat(cctvInfo.getLatitude())
                    .lng(cctvInfo.getLongitude())
                    .zero(crackdownCounts[0])
                    .one(crackdownCounts[1])
                    .two(crackdownCounts[2])
                    .three(crackdownCounts[3])
                    .four(crackdownCounts[4])
                    .five(crackdownCounts[5])
                    .six(crackdownCounts[6])
                    .seven(crackdownCounts[7])
                    .idx(cctvInfo.getId())
                    .build();

            camDataResponses.add(response);
        }

        return camDataResponses;
    }


    private List<PointDataResponse> getPointData(List<Long> stationIdxList) {
        List<Report> reports = reportRepositoryImpl.findReportsByStationIdxAndDateRange(stationIdxList, startOfLastWeek, startOfToday);

        List<PointDataResponse> pointDataResponses = new ArrayList<>();

        for (Report report : reports) {
            System.out.println(report.getReportTime().toLocalTime().toString());
            int timeIndex = TimeIndex.fromTime(report.getReportTime().toLocalTime().toString());

            PointDataResponse response = PointDataResponse.builder()
                    .lat(report.getLatitude())
                    .lng(report.getLongitude())
                    .type(report.getViolationType().getId())
                    .timeIndex(timeIndex)
                    .build();

            pointDataResponses.add(response);
        }

        List<AccidentReport> accidentReports = accidentReportRepositoryImpl.findReportsByStationIdxAndDateRange(stationIdxList, startOfLastWeek, startOfToday);

        for (AccidentReport report : accidentReports) {
            int timeIndex = TimeIndex.fromTime(report.getReportTime().toLocalTime().toString());

            PointDataResponse response = PointDataResponse.builder()
                    .lat(report.getLatitude())
                    .lng(report.getLongitude())
                    .type(6L)
                    .timeIndex(timeIndex)
                    .build();

            pointDataResponses.add(response);
        }

        return pointDataResponses;
    }

    //////////////// cctv info 조회///////////////////
    public CctvInfoReponse searchCctvInfoByTime(Long idx, int time) {
        CCTVInfo cctvInfo = cctvInfoRepository.findById(idx).orElseThrow(()-> new RestApiException(ErrorCode.NOT_FOUND));
        List<CctvCrackdownResponse> cctvCrackdowns = getCrackdownByCctv(idx, time);
        return CctvInfoReponse.builder()
                .addr(cctvInfo.getLocation())
                .crackdown(cctvCrackdowns)
                .build();
    }

    private List<CctvCrackdownResponse> getCrackdownByCctv(Long idx, int time) {
        int startHour = Integer.parseInt(TimeIndex.startTimeOfIndex(time).split(":")[0]); // 시작 시간 추출
        int endHour = Integer.parseInt(TimeIndex.endTimeOfIndex(time).split(":")[0]);

        List<Crackdown> crackdowns = crackdownRepositoryImpl.getCrackdownByCctv(idx, startHour, endHour, startOfLastWeek, startOfToday);
        List<CctvCrackdownResponse> cctvCrackdownResponses = new ArrayList<>();
        for (Crackdown crackdown : crackdowns) {
            System.out.println(crackdown.getId());
            cctvCrackdownResponses.add(CctvCrackdownResponse.builder()
                            .img(crackdown.getImageSrc())
                            .date(crackdown.getCrackdownTime().toLocalDate().toString())
                            .type(crackdown.getViolationType().getId())
                            .idx(crackdown.getId())
                            .build());
        }
        return cctvCrackdownResponses;
    }
}
