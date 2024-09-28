package com.ssafy.kickcap.report.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.dashboard.dto.PointDataResponse;
import com.ssafy.kickcap.report.entity.QReport;
import com.ssafy.kickcap.report.entity.Report;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ReportRepositoryImpl {

    private final JPAQueryFactory queryFactory;
    private final  QReport report = QReport.report;

    // 특정 지역(stationIdxList) 내에서 주어진 날짜 범위(startDate~endDate) 동안 발생한 신고 건수를 날짜별로 집계합니다.
    public Map<LocalDate, Long> countReportsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        DateTemplate<java.sql.Date> reportDate = Expressions.dateTemplate(java.sql.Date.class, "DATE({0})", report.reportTime);

        List<Tuple> results = queryFactory
                .select(reportDate, report.count())
                .from(report)
                .where(report.police.id.in(stationIdxList)
                        .and(report.reportTime.between(startDate, endDate)))
                .groupBy(reportDate)
                .orderBy(reportDate.asc())
                .fetch();

        return results.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(reportDate).toLocalDate(),
                        tuple -> tuple.get(report.count())
                ));
    }


    // 특정 시도 및 구군의 불법 주차 신고 건수를 조회합니다.
    public Long getReportCountByViolationType(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate,Long n) {

        return queryFactory
                .select(report.count())
                .from(report)
                .where(report.violationType.id.eq(n)
                        // violation_type이 1인 경우 (2인 승차)
                        // violation_type이 2인 경우 (보도 주행)
                        // violation_type이 3인 경우 (Helmet 미착용)
                        // violation_type이 4인 경우 (불법 주차)
                        // violation_type이 5인 경우 (지정 차로 위반)
                        .and(report.police.id.in(stationIdxList))
                        .and(report.reportTime.between(startDate, endDate)))
                .fetchOne();
    }

    public Long getReportCountOfDay(List<Long> stationIdxList, ZonedDateTime startDay, ZonedDateTime endDay) {
        return queryFactory
                .select(report.count())
                .from(report)
                .where(report.police.id.in(stationIdxList)
                        .and(report.reportTime.between(startDay, endDay)))
                .fetchOne();
    }

    public List<Report> findReportsByStationIdxAndDateRange(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        return queryFactory.selectFrom(report)
                .where(report.police.id.in(stationIdxList)
                        .and(report.reportTime.between(startDate, endDate)))
                .fetch();
    }
}
