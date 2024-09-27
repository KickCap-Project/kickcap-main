package com.ssafy.kickcap.report.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.report.entity.QReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReportRepositoryImpl {

    private final JPAQueryFactory queryFactory;
    private final  QReport report = QReport.report;

    // 특정 지역(stationIdxList) 내에서 주어진 날짜 범위(startDate~endDate) 동안 발생한 신고 건수를 날짜별로 집계합니다.
    public List<Long> countReportsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {

        // DATE() 함수로 날짜 부분만 추출
        DateTemplate<LocalDate> reportDate = Expressions.dateTemplate(LocalDate.class, "DATE({0})", report.reportTime);

        return queryFactory
                .select(report.count())
                .from(report)
                .where(report.police.id.in(stationIdxList) // 해당 stationIdxList에 포함된 경찰서 ID와 일치하는 신고를 필터링합니다.
                        .and(report.reportTime.between(startDate, endDate))) // 주어진 날짜 범위 내에서 발생한 신고를 필터링합니다.
                .groupBy(reportDate) // DATE(report_time)으로 그룹화
                .orderBy(reportDate.asc())
                .fetch(); // 결과를 리스트로 반환합니다.
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
}
